// layout.jsx
"use client";

import { useEffect } from "react";
import "./globals.css";
import NavBar from "./(gizmoflip)/components/NavBar";
import HeroSec from "./(gizmoflip)/components/HeroSec";

export default function RootLayout({ children }) {
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const res = await fetch("/api/themes");
        const themes = await res.json();
        const savedTheme = localStorage.getItem("theme");
        const fallback = themes[0]?.name;
        const selectedTheme =
          themes.find((t) => t.name === savedTheme)?.name || fallback;

        if (selectedTheme) {
          const linkId = "theme-link";
          let link = document.getElementById(linkId);
          if (!link) {
            link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            document.head.appendChild(link);
          }
          link.href = `/themes/${selectedTheme}.css`;
          localStorage.setItem("theme", selectedTheme); // Save for next load
        }
      } catch (err) {
        console.error("Failed to initialize theme:", err);
      }
    };

    initializeTheme();
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
