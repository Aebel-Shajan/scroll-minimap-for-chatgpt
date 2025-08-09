export function useElementHeight(targetHtml: string| HTMLElement|null) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    let element = targetHtml
    if (!targetHtml) return;
    if (typeof(element) === "string") {
       element = document.querySelector(element) as HTMLElement;
    }
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === element) {
          setHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(element);

    // Initial height set
    setHeight(element.getBoundingClientRect().height);

    return () => {
      observer.disconnect();
    };
  }, [targetHtml]);

  return height;
}