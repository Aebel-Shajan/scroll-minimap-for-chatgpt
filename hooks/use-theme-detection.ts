

/**
 * Detects the theme on the page and updates the theme for the extension.
 */
export default function useThemeDetection() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const checkAndSetTheme = () => {
      const rootElement = document.documentElement;
      const rootBackgroundColor = window.getComputedStyle(rootElement).backgroundColor;
      const isDarkMode = rootBackgroundColor !== "rgb(255, 255, 255)";
      setTheme(isDarkMode ? "dark" : "light");
    };

    checkAndSetTheme();
    const observer = new MutationObserver(checkAndSetTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["style", "class"] 
    });

    return () => observer.disconnect();
  }, [setTheme]);
}