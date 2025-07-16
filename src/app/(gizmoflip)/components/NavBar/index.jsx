"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSwatchbook,
  faBurger,
} from "@fortawesome/free-solid-svg-icons";
import ThemeLoader from "../ThemeLoader";

const NAV_LINKS = [
  { name: "Products", href: "#" },
  { name: "About Us", href: "#" },
  { name: "Contact", href: "#" },
];

const NavBar = () => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef();

  const toggleThemePicker = () => setShowThemePicker((prev) => !prev);
  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);
  const closeMobileMenu = () => setShowMobileMenu(false);

  const NavLinks = ({ isMobile = false }) => (
    <ul className={isMobile ? styles.mobileNavItems : styles.navItems}>
      {NAV_LINKS.map((link) => (
        <li key={link.name} className={styles.navItem}>
          <a href={link.href} onClick={isMobile ? closeMobileMenu : undefined}>
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );

  // Close on outside click or Escape key
  useEffect(() => {
    if (!showMobileMenu) return;

    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        closeMobileMenu();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closeMobileMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showMobileMenu]);

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.siteTitle}>Gizmoflip</span>
          <nav className={styles.desktopNav}>
            <NavLinks />
          </nav>
        </div>

        <div className={styles.icons}>
          <FontAwesomeIcon
            icon={faBurger}
            className={`${styles.icon} ${styles.mobileOnly}`}
            onClick={toggleMobileMenu}
          />
          <FontAwesomeIcon
            className={styles.icon}
            icon={faSwatchbook}
            onClick={toggleThemePicker}
          />
          <FontAwesomeIcon className={styles.icon} icon={faUser} />
        </div>
      </div>

      {showMobileMenu && (
        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          <NavLinks isMobile />
        </div>
      )}

      {showThemePicker && (
        <ThemeLoader onClose={() => setShowThemePicker(false)} />
      )}
    </>
  );
};

export default NavBar;
