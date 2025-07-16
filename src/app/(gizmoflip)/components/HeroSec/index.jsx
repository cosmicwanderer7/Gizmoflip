"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const slogans = [
  "Reduce. Reuse. Recycle.",
  "Buy refurbished. Save the planet.",
  "Keep e-waste out of landfills.",
  "Gizmoflip: Smarter choices for Earth.",
];

const HeroSec = () => {
  const nameRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [sloganIndex, setSloganIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  // Typing effect
  useEffect(() => {
    const currentSlogan = slogans[sloganIndex];
    let timeout;

    if (isWaiting) {
      // Wait period after typing is complete
      timeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2000); // Stay visible for 2 seconds
    } else if (!isDeleting && charIndex < currentSlogan.length) {
      // Typing forward
      setTypedText(currentSlogan.slice(0, charIndex + 1));
      timeout = setTimeout(() => setCharIndex(charIndex + 1), 80);
    } else if (!isDeleting && charIndex === currentSlogan.length) {
      // Finished typing, now wait
      setIsWaiting(true);
    } else if (isDeleting && charIndex > 0) {
      // Deleting backward
      setTypedText(currentSlogan.slice(0, charIndex - 1));
      timeout = setTimeout(() => setCharIndex(charIndex - 1), 40);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next slogan
      setIsDeleting(false);
      setSloganIndex((prev) => (prev + 1) % slogans.length);
      timeout = setTimeout(() => setCharIndex(0), 500);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, isWaiting, sloganIndex]);

  // Gizmoflip animated letters logic (unchanged from your code)
  useEffect(() => {
    const nameEl = nameRef.current;
    if (!nameEl) return;

    const originalHTML = nameEl.innerHTML;
    nameEl.innerHTML = "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = originalHTML;

    function processNode(node, parent) {
      if (node.nodeType === Node.TEXT_NODE) {
        for (let char of node.textContent) {
          if (char === " ") {
            parent.appendChild(document.createTextNode(" "));
          } else {
            const span = document.createElement("span");
            span.textContent = char;
            parent.appendChild(span);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        parent.appendChild(clone);
        node.childNodes.forEach((child) => processNode(child, clone));
      }
    }

    tempDiv.childNodes.forEach((child) => processNode(child, nameEl));

    const variations = ["ss01", "ss02", "ss03", "ss04", "ss05", "ss06"];
    const letters = nameEl.querySelectorAll("span");
    const activeAnimations = new Set();
    let mainTimeout;

    function shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    let shuffledVariations = shuffleArray(variations);
    let currentIndex = 0;

    function getNextVariation() {
      if (currentIndex >= shuffledVariations.length) {
        shuffledVariations = shuffleArray(variations);
        currentIndex = 0;
      }
      return shuffledVariations[currentIndex++];
    }

    function animateLetter(letter) {
      if (activeAnimations.has(letter)) return;
      activeAnimations.add(letter);
      letter.classList.add("animating");
      let count = 0;
      const maxIterations = 12;
      const interval = setInterval(() => {
        requestAnimationFrame(() => {
          const randomVariation =
            variations[Math.floor(Math.random() * variations.length)];
          letter.style.fontFeatureSettings = `"${randomVariation}" 1`;
        });

        count++;
        if (count >= maxIterations) {
          clearInterval(interval);
          requestAnimationFrame(() => {
            const finalVariation = getNextVariation();
            letter.style.fontFeatureSettings = `"${finalVariation}" 1`;
            letter.classList.remove("animating");
            activeAnimations.delete(letter);
          });
        }
      }, 80);
    }

    const handleMouseEnter = (letter) => () => animateLetter(letter);
    const mouseEnterHandlers = [];

    letters.forEach((letter) => {
      const handler = handleMouseEnter(letter);
      mouseEnterHandlers.push({ letter, handler });
      letter.addEventListener("mouseenter", handler, { passive: true });
    });

    function randomAnimationLoop() {
      letters.forEach((letter, index) => {
        setTimeout(
          () => animateLetter(letter),
          index * 100 + Math.random() * 1000,
        );
      });

      const randomDelay = Math.floor(Math.random() * 5000) + 7000;
      mainTimeout = setTimeout(randomAnimationLoop, randomDelay);
    }

    const initialTimeout = setTimeout(randomAnimationLoop, 2000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(mainTimeout);
      activeAnimations.forEach((letter) => {
        letter.classList.remove("animating");
      });
      activeAnimations.clear();
      mouseEnterHandlers.forEach(({ letter, handler }) => {
        letter.removeEventListener("mouseenter", handler);
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.name} ref={nameRef}>
        Gizmoflip
      </div>
      <div className={styles.slogan}>
        {typedText}
        <span className={styles.cursor}>|</span>
      </div>
    </div>
  );
};

export default HeroSec;
