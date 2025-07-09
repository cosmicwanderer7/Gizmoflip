"use client";
import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";

const HeroSec = () => {
  const nameRef = useRef(null);

  useEffect(() => {
    const nameEl = nameRef.current;
    if (!nameEl) return;

    const originalHTML = nameEl.innerHTML;
    nameEl.innerHTML = "";

    // Create temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = originalHTML;

    // Process nodes to wrap each character in spans
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
    const activeAnimations = new Set(); // Track active animations
    let mainTimeout; // Track main animation loop timeout

    // Fisher-Yates shuffle algorithm for better randomization
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
      const maxIterations = 12; // Reduced for better performance

      const interval = setInterval(() => {
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          const randomVariation =
            variations[Math.floor(Math.random() * variations.length)];
          letter.style.fontFeatureSettings = `"${randomVariation}" 1`;
        });

        count++;

        if (count >= maxIterations) {
          clearInterval(interval);
          // Settle on a final variation
          requestAnimationFrame(() => {
            const finalVariation = getNextVariation();
            letter.style.fontFeatureSettings = `"${finalVariation}" 1`;
            letter.classList.remove("animating");
            activeAnimations.delete(letter);
          });
        }
      }, 80); // Slightly slower for better performance
    }

    // Use passive event listeners for better performance
    const handleMouseEnter = (letter) => () => animateLetter(letter);
    const mouseEnterHandlers = [];

    letters.forEach((letter) => {
      const handler = handleMouseEnter(letter);
      mouseEnterHandlers.push({ letter, handler });
      letter.addEventListener("mouseenter", handler, { passive: true });
    });

    // Random animation loop with cleanup tracking
    function randomAnimationLoop() {
      letters.forEach((letter, index) => {
        // Stagger the animations for a wave effect
        setTimeout(
          () => {
            animateLetter(letter);
          },
          index * 100 + Math.random() * 1000,
        );
      });

      // Random delay between 7-12 seconds
      const randomDelay = Math.floor(Math.random() * 5000) + 7000;
      mainTimeout = setTimeout(randomAnimationLoop, randomDelay);
    }

    // Start the animation loop after a brief delay
    const initialTimeout = setTimeout(randomAnimationLoop, 2000);

    // Comprehensive cleanup function
    return () => {
      // Clear all timeouts
      clearTimeout(initialTimeout);
      clearTimeout(mainTimeout);

      // Clear all active animations
      activeAnimations.forEach((letter) => {
        letter.classList.remove("animating");
      });
      activeAnimations.clear();

      // Remove all event listeners
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
    </div>
  );
};

export default HeroSec;
