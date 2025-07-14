"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function ThemeLoader({ onClose }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [search, setSearch] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const originalTheme = useRef("");
  const previewTimeout = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Fetch themes and apply initial theme
    fetch("/api/themes")
      .then((res) => res.json())
      .then((data) => {
        setThemes(data);
        const saved = localStorage.getItem("theme");
        const defaultTheme = "default";
        const themeNames = data.map((t) => t.name);

        const chosenTheme =
          (saved && themeNames.includes(saved) && saved) ||
          (themeNames.includes(defaultTheme) && defaultTheme) ||
          data[0]?.name;

        if (chosenTheme) {
          setSelectedTheme(chosenTheme);
          originalTheme.current = chosenTheme;
          applyTheme(chosenTheme);
          if (!saved) localStorage.setItem("theme", chosenTheme);
        }
      })
      .catch((err) => console.error("Failed to load themes:", err));

    // ESC to close
    const escHandler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", escHandler);

    // Prevent scrolling behind popup
    document.body.style.overflow = "hidden";
    //
    // // Auto-focus search
    // setTimeout(() => {
    //   searchInputRef.current?.focus();
    // }, 100);

    // Add fake browser history entry (Android back support)
    const historyPushDelay = setTimeout(() => {
      window.history.pushState({ themePickerOpen: true }, "");
    }, 200);

    const popHandler = () => {
      if (!isClosing) handleClose();
    };
    window.addEventListener("popstate", popHandler);

    return () => {
      document.removeEventListener("keydown", escHandler);
      window.removeEventListener("popstate", popHandler);
      document.body.style.overflow = "";
      clearTimeout(previewTimeout.current);
      clearTimeout(historyPushDelay);

      if (window.history.state?.themePickerOpen) {
        window.history.back();
      }
    };
  }, []);

  const applyTheme = (themeName) => {
    const linkId = "theme-link";
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `/themes/${themeName}.css`;
  };

  const handleHover = (theme) => {
    clearTimeout(previewTimeout.current);
    if (theme.name !== selectedTheme) {
      previewTimeout.current = setTimeout(() => {
        applyTheme(theme.name);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(previewTimeout.current);
    if (selectedTheme) applyTheme(selectedTheme);
  };

  const handleClick = (theme) => {
    clearTimeout(previewTimeout.current);
    applyTheme(theme.name);
    setSelectedTheme(theme.name);
    originalTheme.current = theme.name;
    localStorage.setItem("theme", theme.name);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    clearTimeout(previewTimeout.current);
    applyTheme(originalTheme.current);
    setTimeout(() => onClose(), 200); // Allow closing animation
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const filteredThemes = themes.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className={`${styles.popupBackdrop} ${isClosing ? styles.closing : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={styles.themeMenu}
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.searchBar}>
          <FontAwesomeIcon
            className={styles.searchIcon}
            icon={faMagnifyingGlass}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search themes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>

        <ul className={styles.themeList}>
          {filteredThemes.length > 0 ? (
            filteredThemes.map((theme) => (
              <li
                key={theme.name}
                className={`${styles.themeItem} ${
                  selectedTheme === theme.name ? styles.active : ""
                }`}
                onMouseEnter={() => handleHover(theme)}
                onClick={() => handleClick(theme)}
              >
                <span className={styles.themeName}>
                  {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                </span>
                {theme.colors?.length > 0 && (
                  <span className={styles.swatches}>
                    {theme.colors.slice(0, 3).map((color, idx) => (
                      <span
                        key={idx}
                        className={styles.dot}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className={styles.noResults}>
              <span className={styles.themeName}>No themes found</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
