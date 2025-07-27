import "@/assets/tailwind.css";
import { extractFilteredTreeBySelectors, queryChatScrollContainer } from "../../lib/chatgptElementUtils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HTMLElementItem } from "@/types";




export default function App() {
  const [isOpen, setIsOpen] = useState(true)

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
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    return () => observer.disconnect();
  }, [setTheme]);




  if (!isOpen) {
    return (
      <TogglePanelButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="fixed top-20 right-5"
      />
    );
  }



  return (
      <div className="bg-sidebar-accent text-black w-70 h-dvh pt-0 border-l-2 border-accent flex flex-col">
          <SidebarProvider className="w-full h-full" >
            <AppSidebar 
              collapsible="none" 
              className="w-full h-full" 
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </SidebarProvider>
      </div>
  )
}