import PresalePage from "./pages/PresalePage";
import WalletContextProvider from "./components/WalletContextProvider";
import { Navbar } from "./components";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ConnectPage from "./components/ConnectPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <WalletContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<PresalePage />} />
            <Route path="/initpresale" element={<ConnectPage />} />
          </Routes>
          <ToastContainer />
        </WalletContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
