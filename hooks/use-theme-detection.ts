import { useTheme } from "@/components/theme-provider";

/**
 * Detects the theme on the page and updates the theme for the extension.
 */
export default function useThemeDetection() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const checkAndSetTheme = () => {
      let rootElement = document.documentElement;
      let rootBackgroundColor = window.getComputedStyle(rootElement).backgroundColor;

      // Check for transparency (rgba(0, 0, 0, 0) or 'transparent')
      if (rootBackgroundColor === 'rgba(0, 0, 0, 0)' || rootBackgroundColor === 'transparent') {
        // Fallback to body
        rootElement = document.body;
        rootBackgroundColor = window.getComputedStyle(rootElement).backgroundColor;
      }

      // If still transparent, default to light mode
      if (rootBackgroundColor === 'rgba(0, 0, 0, 0)' || rootBackgroundColor === 'transparent') {
        setTheme("light");
        return;
      }

      // Extract RGB values
      const rgbMatch = rootBackgroundColor.match(/\d+/g);
      if (!rgbMatch || rgbMatch.length < 3) return;

      const [r, g, b] = rgbMatch.slice(0, 3).map(Number);

      // Calculate relative luminance (standard formula)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Use 0.5 threshold for relative luminance
      const isDarkMode = luminance < 0.5;
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