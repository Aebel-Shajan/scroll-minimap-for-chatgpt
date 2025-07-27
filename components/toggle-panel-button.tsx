import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export function TogglePanelButton(
  {
    isOpen,
    setIsOpen,
    className = ""
  }: {
    isOpen: boolean,
    setIsOpen: CallableFunction,
    className?: string,
  }
) {

  function toggleOpen() {
    setIsOpen((old: boolean) => !old)
  }

  return (
    <Button onClick={toggleOpen} className={cn(className, "w-fit h-fit")}>
      {isOpen ? <PanelRightClose /> : <PanelRightOpen />}
    </Button>
  )
}