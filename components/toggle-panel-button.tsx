import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "./ui/button"
import icon from "@/assets/icon.png"
import { cn } from "@/lib/utils"

export function TogglePanelButton(
  {
    isOpen,
    setIsOpen,
    className = "",
    variant = "default",
  }: {
    isOpen: boolean,
    setIsOpen: CallableFunction,
    className?: string,
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
  }
) {

  function toggleOpen() {
    setIsOpen((old: boolean) => !old)
  }

  return (
    <Button 
    onClick={toggleOpen} 
    className={cn(className, "w-fit h-fit")} 
    variant={variant}
    title="Toggle chatgps"
    >
      {isOpen ? <PanelRightClose />: <img src={icon} width={32}/> }
    </Button>
  )
}