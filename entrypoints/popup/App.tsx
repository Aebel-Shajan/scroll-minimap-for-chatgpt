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
    console.log(messageText)
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
    <Card className="bg-background w-70 h-100 p-0 gap-0 ">
      <div className="w-full h-90 overflow-y-scroll">

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

        <div className="flex flex-col gap-1 w-full p-3">
          <p>This extension only works for <a href="https://chatgpt.com" target="_blank" className="underline">chatgpt.com</a></p>
          <div className="flex gap-1">
            <p className="shrink">On chatgpt.com there should be a button to open the right sidebar. If its not there try reloading the page</p>
            <img className="w-30 rounded-md border-accent-foreground border-2 object-contain" src={usageScreenshot} />
          </div>

          <div className="pt-3">
            <div className="w-full font-bold text-l">Feedback</div>
            <form onSubmit={sendEmail} ref={formRef} className="flex flex-col gap-1">
              <input type="email"
                id="email"
                className="resize-none w-full border-1 border-accent-foreground rounded-md p-0.5"
                placeholder="email (optional)"
                disabled={isLoading}
              />
              <textarea
                id="message"
                name="message"
                className="resize-none w-full h-10 border-1 border-accent-foreground rounded-md p-0.5"
                placeholder="Spotted a bug/have a feature request? Write feedback here..."
                disabled={isLoading}

              />

              <Input
                type="submit"
                className="cursor-pointer"
                disabled={isLoading}

              />
            </form>
          </div>
        </div>
      </div>

      <div className="h-10 w-full flex justify-between p-1 items-center">

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

    </Card>

  );
}

