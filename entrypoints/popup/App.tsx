import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocateFixed } from "lucide-react";
import usageScreenshot from "@/assets/usage-screenshot.png"
import { Input } from "@/components/ui/input";

import emailjs from '@emailjs/browser';
import { useRef } from "react";
import { Toaster, toast } from "sonner";


const SERVICE_ID = "service_l0a9crg"
const PUBLIC_KEY = "93KedpWUhz-tH2a3i"
const TEMPLATE_ID = "template_fwbd5z1"

export default function App() {

  const formRef = useRef<HTMLFormElement>(null)
  const [lastEmailSent, setLastEmailSent] = useState<number>(-1)



  const sendEmail: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.persist();
    e.preventDefault();
    if (lastEmailSent !== -1) {
      const diffMs = (lastEmailSent - Date.now()); // milliseconds between now & Christmas
      const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minute
      if (diffMins < 2) {
        toast.error("Must wait 2 mins between each message sent")
      }
    }

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

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          user_name: "chat-gps",
          user_email: "chat-gps@gmail.com",
          message: messageText,
        }
      )
      .then(
        (result) => {
          toast.success('Message sent!')
          setLastEmailSent(Date.now())
          textArea.value = ""
        },
        (error) => toast.error('Something went wrong, please try again later')
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
        </div>

        <div className="flex flex-col gap-1 w-full p-3">
          <p>This extension only works for <a href="https://chatgpt.com" target="_blank" className="underline">chatgpt.com</a></p>
          <div className="flex gap-1">
            <p className="shrink">On chatgpt.com there should be a button to open the right sidebar. If its not there try reloading the page</p>
            <img className="w-30 rounded-md border-accent-foreground border-2 object-contain" src={usageScreenshot} />
          </div>

          <div className="pt-3">
            <div className="w-full font-bold text-xl">Feedback</div>
            <form onSubmit={sendEmail} ref={formRef}>
              <textarea
                id="message"
                name="message"
                className="resize-none w-full h-15 border-2 border-accent-foreground rounded-md"
                placeholder="Spotted a bug/have a feature request? Write feedback here..."
              />
              <Input
                type="submit"
                style={{
                  cursor: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewBox='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🙏</text></svg>`
                  )}") 0 20, auto`,
                }}
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

