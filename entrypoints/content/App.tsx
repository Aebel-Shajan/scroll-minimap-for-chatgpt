import "@/assets/tailwind.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TogglePanelButton } from "@/components/toggle-panel-button";
import AppSidebarRewrite from "@/components/app-sidebar-rewrite";


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


  const fixedPosClass = " fixed top-10 right-5"

  if (!isOpen) {
    document.body.style.width = "100vw"
    return (

      <TogglePanelButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant={"outline"}
        className={"fixed top-60 right-5 z-100 cursor-pointer !p-1" + fixedPosClass}
      />


    );
  }


  document.body.style.width = "calc(100vw - 280px)"
  return (
    <AppSidebarRewrite
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className={fixedPosClass}
    />

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