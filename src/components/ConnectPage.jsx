import React from "react";
import "./ConnectPage.css";
import { connectLogo } from "../assets";
import { NavLink } from "react-router-dom";

const ConnectPage = () => {
  return (
    <>
      <header className="header">
        <nav className="navContainer">
          <div>
            <NavLink to="/">
              <p className="logoText">CUCKCOIN</p>
            </NavLink>
          </div>

          <button className="btnHeader">Connect</button>
        </nav>
      </header>

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
              <input className="input" />
            </div>

            <div>
              <button className="btn">INIT</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ConnectPage;
