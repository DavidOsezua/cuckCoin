import { useEffect, useState } from "react";
import styles from "./Presale.module.css";
import { Navbar, Timer, Footer, Card } from "../components";

const PresalePage = () => {
  return (
    <div className={`${styles.section}`}>
      <Navbar />

      <main className={`text-center text-[#fff] ${styles.main} mb-[4rem]`}>
        <h2 className={`${styles.title}`}>BUY CUCK COIN</h2>

        <Timer />

        <Card
          className={`flex justify-between px-[1rem] py-[0.8rem] items-center`}
        >
          <div className={`flex flex-col`}>
            <label>You Send</label>
            <input type="number" className={`${styles.input}`} />
          </div>

          <select className="text-[#0D0D36] font-bold bg-[#fff] py-[0.5rem] px-[1.2rem] outline-none rounded-md">
            <option value="BNB" className="text-[#0D0D36]" selected>
              Token
            </option>
            <option value="USDT" className="text-[#0D0D36]">
              USDT
            </option>
            <option value="BUSD" className="text-[#0D0D36]">
              BUSD
            </option>
          </select>
        </Card>

        <h2 className="text-[#fff]">
          1 USDT = <span>1000 </span> Cuck
        </h2>

        <Card
          className={`flex justify-between px-[1rem] py-[0.8rem] items-center`}
        >
          <div className={`flex flex-col`}>
            <label>You Receive</label>
            <input type="text" className={`${styles.input}`} />
          </div>

          <select className="text-[#0D0D36] bg-[#fff] font-bold py-[0.5rem] px-[1.2rem] rounded-md">
            <option value="BUSD" className="text-[#FFF]">
              PEPMAS
            </option>
          </select>
        </Card>

        <button className={styles.button}>Connect Wallet</button>
      </main>

      <Footer />
    </div>
  );
};

export default PresalePage;
