import { useState } from "react";
import styles from "./Navbar.module.css";
import { logo, linkArrow } from "../assets";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);

  return (
    <header className={`${styles.header}`}>
      <nav className={`${styles.navContainer}`}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div className="flex items-center gap-[3px]">
          <a
            href="http://christmaspepe.com/"
            className="text-[#fff] text-[300]"
          >
            {" "}
            Back Home{" "}
          </a>
          <img src={linkArrow} />
        </div>
        <button
          className={` px-2 bg-[#0AA7FF] rounded-[3px] 
 text-[#fff] ${styles.btn}`}
        >
          Connect Wallet
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
