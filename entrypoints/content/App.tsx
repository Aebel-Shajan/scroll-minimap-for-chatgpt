import "@/assets/tailwind.css";
import { SidebarProvider } from "@/components/ui/sidebar";



export default function App() {
  const [isOpen, setIsOpen] = useSyncedStorage("sidebarOpen", false)

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
    document.body.style.width = "100vw"
    return (
      <TogglePanelButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="fixed top-40 right-5"
      />
    );
  }


  document.body.style.width = "calc(100vw - 280px)"
  return (
    <div className="bg-sidebar-accent text-black w-[280px] h-dvh pt-0 border-l-2 border-accent flex fixed top-0 right-0">
      <SidebarProvider >
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


// function addButtonToHeader(header: HTMLElement, setIsOpen: CallableFunction) {
//   if (header.querySelectorAll(".sidebarOpenButtonWXT").length === 0) {
//     const openButton = document.createElement("button")
//     openButton.className = "sidebarOpenButtonWXT"
//     openButton.innerText = "Toggle ChatGPS"
//     openButton.onclick = () => {
//       setIsOpen((oldValue: boolean) => !oldValue)
//     }
//     Object.assign(openButton.style, {
//       backgroundColor: 'black',       // ChatGPT green
//       color: 'white',
//       padding: '0.5rem 1rem',
//       fontSize: '0.5rem',
//       fontWeight: '500',
//       border: 'none',
//       borderRadius: '0.375rem',         // rounded-md
//       cursor: 'pointer',
//       transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
//       margin: '1rem',                   // spacing if needed
//     });
//     header.appendChild(openButton)
//   }
// }