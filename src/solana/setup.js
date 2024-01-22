import {
    PRESALE_ACCOUNT_DATA_LAYOUT,
} from "./utils";
import {
    //Connection,
    Keypair, PublicKey,
    //Signer,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";
import { Buffer } from "buffer/";
import BN from "bn.js";
import {
    AccountLayout, 
    createInitializeAccountInstruction,
    createTransferInstruction,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { getOrCreateAssociatedTokenAccount } from "./utils";
import { PRESALE_TOKEN_DECIMALS } from "./constants";


const initializePresale = async (
    connection,
    signTransaction,
    program_id,
    presale_token_mint,
    owner_pub_key,  
    presale_token_amount,
    start_time, 
    presale_token_price
) => {

    const presaleTokenAccountKeypair = new Keypair();
    const presaleAccountKeypair = new Keypair();

    // We're assuming here that the token has been created and minted into the owner's account prior to calling this function
    const presaleMintPubKey = new PublicKey(presale_token_mint);
    const ownerTokenAccount = (await getOrCreateAssociatedTokenAccount(
        connection, 
        owner_pub_key,
        presaleMintPubKey,
        owner_pub_key,
        signTransaction
    )).address
    const createPresaleTokenAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await connection.getMinimumBalanceForRentExemption(
            AccountLayout.span
        ),
        fromPubkey: owner_pub_key,
        newAccountPubkey: presaleTokenAccountKeypair.publicKey,
    });
    const initPresaleTokenAccountIx = createInitializeAccountInstruction(
        presaleTokenAccountKeypair.publicKey,
        presaleMintPubKey,
        owner_pub_key
    );
    const transferPresaleTokensToPresaleTokenAccIx = createTransferInstruction(
        ownerTokenAccount,
        presaleTokenAccountKeypair.publicKey,
        owner_pub_key,
        presale_token_amount*(10**PRESALE_TOKEN_DECIMALS),
        [],
        TOKEN_PROGRAM_ID
    );
    const createPresaleAccountIx = SystemProgram.createAccount({
        space: PRESALE_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(
            PRESALE_ACCOUNT_DATA_LAYOUT.span
        ),
        fromPubkey: owner_pub_key,
        newAccountPubkey: presaleAccountKeypair.publicKey,
        programId: new PublicKey(program_id),
    });
    const initPresaleIx = new TransactionInstruction({
        programId: new PublicKey(program_id),
        keys: [
            { pubkey: owner_pub_key, isSigner: true, isWritable: false },
            {
                pubkey: presaleTokenAccountKeypair.publicKey,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: presaleAccountKeypair.publicKey,
                isSigner: false,
                isWritable: true,
            },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: Buffer.from(
            Uint8Array.of(
                0,
                ...new BN(start_time).toArray("le", 8),
                ...new BN(presale_token_price).toArray("le", 8)
            )
        ),
    });

    // Send Transaction
    const txn = new Transaction().add(
        createPresaleTokenAccountIx,
        initPresaleTokenAccountIx,
        transferPresaleTokensToPresaleTokenAccIx,
        createPresaleAccountIx,
        initPresaleIx
    );
    const blockHash = await connection.getRecentBlockhash();
    txn.feePayer = await owner_pub_key;
    txn.recentBlockhash = await blockHash.blockhash;
    txn.partialSign(...[presaleTokenAccountKeypair, presaleAccountKeypair]);
    //txn.partialSign(presaleTokenAccountKeypair);
    const signed = await signTransaction(txn);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);
    return { presaleAccount: presaleAccountKeypair.publicKey.toString(), presaleTokenAccount: presaleTokenAccountKeypair.publicKey.toString()}
}

export default initializePresale;