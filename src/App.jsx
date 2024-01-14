import PresalePage from "./pages/PresalePage";
import "./App.css";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { bsc } from "viem/chains";
const projectId = "61f529aa30c77838f2502740d05202ad";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [bsc];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

const App = () => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <PresalePage />
        <ToastContainer />
      </WagmiConfig>
    </>
  );
};

export default App;
