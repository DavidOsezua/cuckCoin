import styles from "./Presale.module.css";
import { Timer, Card } from "../components";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";


const PresalePage = () => {

  const [presaleState, setState] = useState({sendAmount: 0, receiveAmount: 0});
  const quotePrice = 0.003/94;

  const handleTokenBuy = () => {
    console.log(`I'm sending ${presaleState.sendAmount} sol and recieving ${presaleState.receiveAmount} CUCK Tokens`)
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
            <input type="number" className={`${styles.input}`} value={presaleState.sendAmount} onChange={(e) => setState({sendAmount: e.target.value, receiveAmount: e.target.value / quotePrice})} />
          </div>

          <div className="flex gap-[0.5rem] items-center">
            <p className="text-[0.9rem] font-bold text-[#000]">
              Balance : 0.0
            </p>

            <select className="text-[#0D0D36] font-bold bg-[#fff] py-[0.5rem] px-[1.2rem] outline-none rounded-md">
              <option value="SOL" className="text-[#0D0D36]" selected>
                SOLANA
              </option>
            </select>
          </div>
        </Card>

        <h2 className="text-[#000] font-bold">
          1 CUCK = <span className="font-bold">USD 0.003 </span>
        </h2>

        <Card
          className={`flex justify-between px-[1rem] py-[0.8rem] items-center`}
        >
          <div className={`flex flex-col`}>
            <label>You Receive</label>
            <input type="text" className={`${styles.input}`} value={presaleState.receiveAmount} onChange={(e) => setState({sendAmount: e.target.value * quotePrice, receiveAmount: e.target.value})} />
          </div>

          <select className="text-[#0D0D36] bg-[#fff] font-bold py-[0.5rem] px-[1.2rem] rounded-md">
            <option value="CUCK" className="text-[#FFF]" selected>
              CUCK
            </option>
          </select>
        </Card>
        <button className={styles.button} onClick={handleTokenBuy}>Buy</button>
      </main>
    </div>
  );
};

export default PresalePage;
