import PresalePage from "./pages/PresalePage";
import WalletContextProvider from './components/WalletContextProvider';
import { Navbar } from "./components";
import "./App.css";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <WalletContextProvider>
      <Navbar />
      <PresalePage />
      <ToastContainer />
    </WalletContextProvider>
  );
};

export default App;
