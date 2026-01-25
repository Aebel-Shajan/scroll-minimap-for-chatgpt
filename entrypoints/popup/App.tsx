import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocateFixed } from "lucide-react";
import usageScreenshot from "@/assets/usage-screenshot.png"
import { Input } from "@/components/ui/input";

import emailjs from '@emailjs/browser';
import { useRef } from "react";
import { Toaster, toast } from "sonner";
import { BiLogoGithub } from "react-icons/bi";


const SERVICE_ID = "service_l0a9crg"
const PUBLIC_KEY = "93KedpWUhz-tH2a3i"
const TEMPLATE_ID = "template_fwbd5z1"

export default function App() {

  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [commands, setCommands] = useState<globalThis.Browser.commands.Command[]>([]);

  useEffect(() => {
    // Fetch commands from the Chrome API
    if (typeof browser !== 'undefined' && browser.commands) {
      browser.commands.getAll((availableCommands) => {
        setCommands(availableCommands);
      });
    }
  }, []);



  const sendEmail: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.persist();
    e.preventDefault();


    const form = formRef.current
    if (!form) {
      toast.error(`Couldn't find form`,)
      return
    }

    emailjs.init({
      publicKey: PUBLIC_KEY
    })

    const textArea = form.querySelector("#message") as HTMLTextAreaElement
    if (!textArea) {
      toast.error(`Couldn't find textarea`,)
      return
    }
    const messageText = textArea.value
    if (messageText?.length === 0) {
      toast.error(`Form should not be empty!`,)
      return;
    }
    const emailInput = form.querySelector("#email") as HTMLInputElement

    setIsLoading(true)
    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          user_name: "chat-gps",
          user_email: emailInput.value,
          message: messageText,
        }
      )
      .then(
        (result) => {
          toast.success('Message sent!')
          textArea.value = ""
          setIsLoading(false)
        },
        (error) => {
          toast.error('Something went wrong, please try again later')
          setIsLoading(false)
        }
      );


  };
  return (
    <div className="bg-background w-70 h-120 p-0 gap-0 relative">
      <div className="w-full h-full overflow-y-scroll">

        <Toaster
          position="top-center"
        />
        <div className="p-2 flex justify-between">
          <Button
            className="text-[1.125rem] flex gap-1 items-center justify-start cursor-pointer"
            variant="ghost"
            asChild
          >
            <a
              href="https://chromewebstore.google.com/detail/chat-gpt-scroll-map/apekbedjllgmacohbcckgipfhjddehkf"
              target="_blank"
            >
              <LocateFixed />
              Chat GPS
            </a>
          </Button>
          <Button asChild variant="ghost">
            <a href="https://github.com/Aebel-Shajan/scroll-minimap-for-chatgpt" target="_blank">
              <BiLogoGithub />
            </a>
          </Button>
        </div>

        <div className="flex flex-col gap-3 w-full p-3 pt-0">
          <div className="flex justify-between items-center">

            <h1 className="font-bold">Compatibility:</h1>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <a href="https://chatgpt.com" target="_blank">
                  <img src="https://chatgpt.com/cdn/assets/favicon-eex17e9e.ico" alt="ChatGPT" className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href="https://claude.ai" target="_blank">
                  <img src="https://claude.ai/favicon.ico" alt="Claude" className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href="https://gemini.google.com" target="_blank">
                  <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg" alt="Gemini" className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold">Usage</h1>
            <p className="shrink">There should be a button to open the overlay. If its not there try reloading the page</p>
          </div>
          <div className="w-full">
            <h1 className="font-bold">Shortcuts</h1>
            {commands.map(command => {
              if (!command.shortcut) return
              return (
                <div className="w-full flex justify-between border-b-1">
                  <div className="font text-muted-foreground">
                    {command.name}
                  </div>
                  <div>
                    {command.shortcut}
                  </div>
                </div>
              )
            })}
          </div>

          <div >
            <div className="w-full font-bold text-l">Feedback</div>
            <form onSubmit={sendEmail} ref={formRef} className="flex flex-col gap-1">
              <input type="email"
                id="email"
                className="resize-none w-full border-1 border-accent-foreground rounded-md p-0.5"
                placeholder="email (optional)"
                disabled={isLoading}
              />
              <div className="flex items-center gap-1">
                <textarea
                  id="message"
                  name="message"
                  className="resize-none w-full h-20 border-1 border-accent-foreground rounded-md p-0.5"
                  placeholder="Spotted a bug/have a feature request? Write feedback here..."
                  disabled={isLoading}

                />

                <input
                  type="submit"
                  className="cursor-pointer text-xs w-10 h-20  bg-foreground rounded border-accent-foreground hover:opacity-40"
                  disabled={isLoading}
                  value="✉️"
                />
              </div>

            </form>
          </div>
          <div className="flex flex-col gap-1">

            <Button asChild

            >
              <a href="https://www.buymeacoffee.com/aebel" target="_blank" className="text-xs"


              >
                Buy me a coffee ☕️

              </a>
            </Button>

            <Button
              variant="ghost"
              asChild
            >
              <a href="https://aebel-shajan.github.io" target="_blank" className="text-xs">
                <p>made by Aebel</p>
              </a>
            </Button>
          </div>
        </div>

      </div>
    </div>

  );
}

