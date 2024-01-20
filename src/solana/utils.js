import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token'
import { PublicKey, Transaction, TransactionInstruction, SystemProgram, SYSVAR_RENT_PUBKEY, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { PRESALE_TOKEN_DECIMALS } from './constants'

export async function getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve = false,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
    if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error('TokenOwnerOffCurveError')

    const [address] = await PublicKey.findProgramAddress(
        [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
        associatedTokenProgramId
    )

    return address
}

export const AccountState = {
    Uninitialized: 0,
    Initialized: 1,
    Frozen: 2,
}

export async function getAccountInfo(
    connection,
    address,
    commitment,
    programId = TOKEN_PROGRAM_ID
) {
    const info = await connection.getAccountInfo(address, commitment)
    if (!info) throw new Error('TokenAccountNotFoundError')
    if (!info.owner.equals(programId)) throw new Error('TokenInvalidAccountOwnerError')
    if (info.data.length != AccountLayout.span) throw new Error('TokenInvalidAccountSizeError')

    const rawAccount = AccountLayout.decode(Buffer.from(info.data))

    return {
        address,
        mint: rawAccount.mint,
        owner: rawAccount.owner,
        amount: rawAccount.amount,
        delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
        delegatedAmount: rawAccount.delegatedAmount,
        isInitialized: rawAccount.state !== AccountState.Uninitialized,
        isFrozen: rawAccount.state === AccountState.Frozen,
        isNative: !!rawAccount.isNativeOption,
        rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
        closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null,
    }
}


export function createAssociatedTokenAccountInstruction(
    payer,
    associatedToken,
    owner,
    mint,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedToken, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ]

    return new TransactionInstruction({
        keys,
        programId: associatedTokenProgramId,
        data: Buffer.alloc(0),
    })
}

export async function getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner,
    signTransaction,
    allowOwnerOffCurve = false,
    commitment,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
    const associatedToken = await getAssociatedTokenAddress(
        mint,
        owner,
        allowOwnerOffCurve,
        programId,
        associatedTokenProgramId
    )

    // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
    // Sadly we can't do this atomically.
    let account
    try {
        account = await getAccountInfo(connection, associatedToken, commitment, programId)
    } catch (error) {
        // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
        // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
        // TokenInvalidAccountOwnerError in this code path.
        if (error.message === 'TokenAccountNotFoundError' || error.message === 'TokenInvalidAccountOwnerError') {
            // As this isn't atomic, it's possible others can create associated accounts meanwhile.
            try {
                const transaction = new Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        payer,
                        associatedToken,
                        owner,
                        mint,
                        programId,
                        associatedTokenProgramId
                    )
                )

                const blockHash = await connection.getRecentBlockhash()
                transaction.feePayer = await payer
                transaction.recentBlockhash = await blockHash.blockhash
                const signed = await signTransaction(transaction)

                const signature = await connection.sendRawTransaction(signed.serialize())
                await connection.confirmTransaction(signature)
            } catch (error) {
                console.log(error)
                // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
                // instruction error if the associated account exists already.
            }

            // Now this should always succeed
            account = await getAccountInfo(connection, associatedToken, commitment, programId)
        } else {
            throw error
        }
    }

    // if (!account.mint.equals(mint.toBuffer())) throw Error('TokenInvalidMintError')
    // if (!account.owner.equals(owner.toBuffer())) throw new Error('TokenInvalidOwnerError')

    return account
}

export function formatAmount(amount, decimal) {
    return amount/(10**decimal)
}

export async function getTokenBalance(tokenAccount, connection){
    return formatAmount(
        parseInt((await connection.getTokenAccountBalance(tokenAccount)).value.amount),
        PRESALE_TOKEN_DECIMALS
    );
}

export async function getSolBalance(connection, pubkey){
    const bal = await connection.getBalance(pubkey);
    return bal/LAMPORTS_PER_SOL
}