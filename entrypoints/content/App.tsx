import "@/assets/tailwind.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { createRoot } from "react-dom/client";




function TogglePanelButton(
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

export default function App() {
  const [isOpen, setIsOpen] = useState(true)


  if (!isOpen) {
    return (
      <TogglePanelButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    );
  }


  return (
    <Card className="bg-gray-50 text-black fixed top-0 right-0 w-50 h-full pt-0">
      <div className="flex justify-between items-center pr-5 bg-background border-b-1">
        <TogglePanelButton isOpen={isOpen} setIsOpen={setIsOpen} />
        Sidepanel
      </div>
      <CardContent>

      </CardContent>
    </Card>
  )
}