// Updated NavBar.js
"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSwatchbook } from "@fortawesome/free-solid-svg-icons";
import ThemeLoader from "../ThemeLoader";

const NavBar = () => {
  const [showThemePicker, setShowThemePicker] = useState(false);

  const toggleThemePicker = () => {
    setShowThemePicker((prev) => !prev);
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          Gizmoflip
          <nav>
            <ul className={styles.navitems}>
              <li className={styles.box}>
                <a>Products</a>
              </li>
              <li className={styles.box}>
                <a>About</a>
              </li>
              <li className={styles.box}>
                <a>Contact</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.icons}>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faSwatchbook}
            onClick={toggleThemePicker}
          />
          <FontAwesomeIcon className={styles.icon} icon={faUser} />
        </div>
      </div>
      {showThemePicker && (
        <ThemeLoader onClose={() => setShowThemePicker(false)} />
      )}
    </>
  );
};

export default NavBar;

// Keep your layout.js unchanged:
// layout.js stays exactly the same as you have it
