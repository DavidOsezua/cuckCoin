import "./InitPresale.css";
import { connectLogo } from "../assets";
import { useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { PRESALE_PROGRAM_ID, PRESALE_TOKEN_MINT, SOLANA_CONNECTION_URL, TOKEN_PRICE_PER_SOL } from "../solana/constants";
import initializePresale from "../solana/setup";
import { toast, ToastContainer } from "react-toastify";

const InitPresalePage = () => {
  const [ presaleTokenAmount, setAmount ] = useState(0);
  const [presaleState, setState] = useState({presaleTokenAccount: "", presaleAccount: ""});
  const { publicKey, signTransaction } = useWallet();
  const connection = useMemo(
    () => new Connection(SOLANA_CONNECTION_URL, "confirmed"),
    []
  );

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  }

  const saveDataToFile = (data) => {
    // create file in browser
    const fileName = "cuck-presale";
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  const handlePresaleInit = async () => {
    try {
      const data = await initializePresale(
        connection,
        signTransaction,
        PRESALE_PROGRAM_ID,
        PRESALE_TOKEN_MINT,
        publicKey,
        presaleTokenAmount,
        1705654800,
        TOKEN_PRICE_PER_SOL
      )
      setState(data);
      try {
        saveDataToFile(data);
      } catch (error) {
        toast.error(`Error saving data to file!!: ${error}`);
        console.log(error);
      }
      toast.success("Presale initialization successfull!. Data saved at cuck-presale.json")
    } catch (error) {
      console.log(error);
      toast.error(`Error initializing presale!!: ${error}`)
    }
  }

  return (
    <>
      <main>
        <section className="section">
          <div className="sectionContainer">
            <div className="logo">
              <img src={connectLogo} />
            </div>

            <p className="sectionText">
              Enter amount of presale cuckoin token below
            </p>

            <div className="inputContainer">
              <input className="input" type="number" value={presaleTokenAmount} onChange={handleInputChange} />
            </div>

            <div>
              <button className="btn" disabled={publicKey != null && presaleTokenAmount != 0 ? false : true} onClick={handlePresaleInit}>INIT</button>
            </div>
            <div style={{alignItems: "center"}}>
              <h1 style={{fontSize: 30}}>Presale Token Account: {presaleState.presaleTokenAccount}</h1>
              <h1 style={{fontSize: 30}}>Presale State Account: {presaleState.presaleAccount}</h1>
            </div>
          </div>
        </section>
      </main>
      <ToastContainer />
    </>
  );
};

export default InitPresalePage;
