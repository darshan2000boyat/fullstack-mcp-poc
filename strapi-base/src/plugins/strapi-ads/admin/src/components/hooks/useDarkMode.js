import { useState, useEffect } from 'react';

/**
 * Custom hook to detect dark mode by checking for the 'dark-mode' class on the body element
 * @returns {boolean} - True if dark mode is active, false otherwise
 */
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize with current dark mode state
    return document.body.classList.contains('dark-mode');
  });

  useEffect(() => {
    // Create a MutationObserver to watch for class changes on the body element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setIsDarkMode(document.body.classList.contains('dark-mode'));
        }
      });
    });

    // Start observing the body element for attribute changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return isDarkMode;
};

export default useDarkMode;
