import styles from "./Presale.module.css";
import { Timer, Card } from "../components";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Buffer } from "buffer/";
import * as BN from "bn.js";
import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { 
  getOrCreateAssociatedTokenAccount,
  getTokenBalance,
  getSolBalance
} from '../solana/utils';
import { 
  PRESALE_PROGRAM_ID, 
  PRESALE_TOKEN_MINT, 
  PRESALE_OWNER_PUB_KEY, 
  PRESALE_STATE_ACCOUNT_PUB_KEY,
  PRESALE_TOKEN_ACCOUNT_PUB_KEY,
  TOKEN_PRICE_PER_SOL,
  SOLANA_CONNECTION_URL
} from "../solana/constants";


const PresalePage = () => {

  const [presaleState, setState] = useState({sendAmount: 0, receiveAmount: 0});
  const [userBalance, setUserBalance] = useState({sol: 0, cuck: 0});
  const { publicKey, signTransaction } = useWallet();
  const connection = useMemo(() => new Connection(SOLANA_CONNECTION_URL, "confirmed"), []);
  
  useEffect(() => {
      async function fetchBalances() {
        try {
          const userTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            publicKey,
            new PublicKey(PRESALE_TOKEN_MINT),
            publicKey,
            signTransaction
          );
          const tokenBalance = await getTokenBalance(userTokenAccount.address, connection);
          const solBalance = await getSolBalance(connection, publicKey);
          setUserBalance({cuck: tokenBalance, sol: solBalance});
        } catch {
          toast.error("Error fetching user balances..")
        }
      }
      if (publicKey) {
        fetchBalances()
      }
    }, [connection, publicKey, signTransaction]
  )

  const handleTokenBuy = async () => {
    try {
      const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(PRESALE_TOKEN_MINT),
        publicKey,
        signTransaction
      );
      const PDA = await PublicKey.findProgramAddress(
        [Buffer.from("presale")],
        new PublicKey(PRESALE_PROGRAM_ID)
      );
      const buyInstruction = new TransactionInstruction({
        programId: PRESALE_PROGRAM_ID,
        data: Buffer.from(
            Uint8Array.of(1, ...new BN(presaleState.sendAmount*LAMPORTS_PER_SOL).toArray("le", 8))
        ),
        keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: buyerTokenAccount.address, isSigner: false, isWritable: true },
            { pubkey: new PublicKey(PRESALE_TOKEN_ACCOUNT_PUB_KEY), isSigner: false, isWritable: true },
            {
                pubkey: new PublicKey(PRESALE_OWNER_PUB_KEY),
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: new PublicKey(PRESALE_STATE_ACCOUNT_PUB_KEY),
                isSigner: false,
                isWritable: true,
            },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            { pubkey: PDA[0], isSigner: false, isWritable: false },
        ],
      });
      const transaction = new Transaction().add(
        buyInstruction
      )
      const blockHash = await connection.getRecentBlockhash();
      transaction.feePayer = await publicKey;
      transaction.recentBlockhash = await blockHash.blockhash;
      const signed = await signTransaction(transaction);
  
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      const tokenBalance = await getTokenBalance(buyerTokenAccount.address, connection);
      const solBalance = await getSolBalance(connection, publicKey);
      setUserBalance({cuck: tokenBalance, sol: solBalance});
      setState({sendAmount: 0, receiveAmount: 0});
      toast.success("Token Bought Succesfully !");
    } catch (e) {
      console.log(e)
      toast.error("An Error Occurred !");
    }
  }

  return (
    <div className={`${styles.section}`}>
      <main className={`text-center text-[#fff] ${styles.main} `}>
        <h2 className={`${styles.title}`}>BUY CUCK COIN</h2>

        <Timer />

        <Card
          className={`flex justify-between px-[1rem] py-[0.8rem] items-center`}
        >
          <div className={`flex flex-col`}>
            <label>You Send</label>
            <input type="number" className={`${styles.input}`} value={presaleState.sendAmount} onChange={(e) => setState({sendAmount: e.target.value, receiveAmount: e.target.value * TOKEN_PRICE_PER_SOL})} />
          </div>

          <div className="flex gap-[0.5rem] items-center">
            <p className="text-[0.9rem] font-bold text-[#000]">
              Balance : {userBalance.sol} SOL
            </p>

            <select className="text-[#0D0D36] font-bold bg-[#fff] py-[0.5rem] px-[1.2rem] outline-none rounded-md" defaultValue={"SOL"}>
              <option value="SOL" className="text-[#0D0D36]">
                SOLANA
              </option>
            </select>
          </div>
        </Card>

        <h2 className="text-[#000] font-bold">
          1 SOL = <span className="font-bold">{TOKEN_PRICE_PER_SOL} CUCK</span>
        </h2>

        <Card
          className={`flex justify-between px-[1rem] py-[0.8rem] items-center`}
        >
          <div className={`flex flex-col`}>
            <label>You Receive</label>
            <input type="text" className={`${styles.input}`} value={presaleState.receiveAmount} onChange={(e) => setState({sendAmount: e.target.value / TOKEN_PRICE_PER_SOL, receiveAmount: e.target.value})} />
          </div>
          <div className="flex gap-[0.5rem] items-center">
          <p className="text-[0.9rem] font-bold text-[#000]">
              Balance : {userBalance.cuck} CUCK
            </p>
            <select className="text-[#0D0D36] bg-[#fff] font-bold py-[0.5rem] px-[1.2rem] rounded-md" defaultValue={"CUCK"}>
              <option value="CUCK" className="text-[#FFF]">
                CUCK
              </option>
            </select>
          </div>
        </Card>
        <button className={styles.button} onClick={handleTokenBuy} disabled={!publicKey || presaleState.sendAmount == 0 || presaleState.receiveAmount == 0 ? true : false}>Buy</button>
      </main>
      <ToastContainer />
    </div>
  );
};

export default PresalePage;
