// layout.jsx
"use client";

import { useEffect } from "react";
import "./globals.css";
import NavBar from "./(gizmoflip)/components/NavBar";
import HeroSec from "./(gizmoflip)/components/HeroSec";

export default function RootLayout({ children }) {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const fallback = "default"; // fallback theme name
    const themeToApply = saved || fallback;

    const linkId = "theme-link";
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `/themes/${themeToApply}.css`;
  }, []);

  return (
    <html lang="en">
      <body>
        <NavBar />
        <HeroSec />
        {children}
      </body>
    </html>
  );
}
