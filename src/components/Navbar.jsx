import styles from "./Navbar.module.css";
import { logo, linkArrow } from "../assets";
import { NavLink } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <header className={`${styles.header}`}>
      <nav className={`${styles.navContainer}`}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div className="flex items-center gap-[3px]">
          <a href="http://cucktoken.xyz" className="text-[#fff] text-[300]">
            {" "}
            Back Home{" "}
          </a>
          <img src={linkArrow} />
        </div>
        <NavLink to="/connect">
          <WalletMultiButton style={{ backgroundColor: "#512da8" }} />
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
