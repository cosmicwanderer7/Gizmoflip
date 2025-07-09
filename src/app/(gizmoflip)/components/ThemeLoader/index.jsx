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
    // Load themes and set initial theme
    fetch("/api/themes")
      .then((res) => res.json())
      .then((data) => {
        setThemes(data);
        const saved = localStorage.getItem("theme");
        const fallback = data[0]?.name;
        const currentTheme = data.find((t) => t.name === saved)
          ? saved
          : fallback;
        setSelectedTheme(currentTheme);
        originalTheme.current = currentTheme;
      })
      .catch((error) => {
        console.error("Failed to load themes:", error);
      });

    // Event listeners
    const escHandler = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", escHandler);
    document.body.style.overflow = "hidden";

    // Auto-focus search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "";
      clearTimeout(previewTimeout.current);
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
      }, 300); // Reduced delay for better UX
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(previewTimeout.current);
    // Revert to selected theme if hovering away
    if (selectedTheme) {
      applyTheme(selectedTheme);
    }
  };

  const handleClick = (theme) => {
    clearTimeout(previewTimeout.current);
    applyTheme(theme.name);
    localStorage.setItem("theme", theme.name);
    setSelectedTheme(theme.name);
    originalTheme.current = theme.name;
  };

  const handleClose = () => {
    if (isClosing) return;

    setIsClosing(true);
    clearTimeout(previewTimeout.current);
    applyTheme(originalTheme.current);

    // Add a small delay to allow exit animation
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const filteredThemes = themes.filter((theme) =>
    theme.name.toLowerCase().includes(search.toLowerCase()),
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
            value={search}
            placeholder="Search themes..."
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

                {theme.colors && theme.colors.length > 0 && (
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
