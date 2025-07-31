import { extractChatId, ICON_MAP, queryChatScrollContainer } from "@/lib/chatgptElementUtils"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { cn } from "@/lib/utils"
import { ExternalLink, StarIcon } from "lucide-react"
import { buttonVariants } from "./ui/button"
import { favouritedChat } from "@/types"

export default function FavouritesSection() {

  const { favourites, setFavourites } = useContext(FavouriteContext)
  function removeFavourite(uniqueId: string) {
    setFavourites((old: Record<string, favouritedChat>) => {
      const newFavs = { ...old }
      delete newFavs[uniqueId]
      return newFavs
    })
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Favourites
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0">
          {Object.keys(favourites).map((key) => (
            <FavItem uniqueKey={key} favChat={favourites[key]} removeFav={removeFavourite} key={key} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function FavItem({ favChat, removeFav, uniqueKey }: { favChat: favouritedChat, removeFav: CallableFunction, uniqueKey: string }) {
  const isOnPage = extractChatId(window.location.href) == favChat.chatId


  function goToFav() {
    if (!isOnPage) {
      window.open(`https://chat.com/c/${favChat.chatId}`, "_self")
      return
    }
    const scrollContainer = queryChatScrollContainer()
    if (scrollContainer) {
      scrollContainer.scrollTo(0, favChat.scrollTop)
    }
  }
  const FavChatIcon = ICON_MAP[favChat.iconName]
  return (
    <SidebarMenuItem
    >
      <SidebarMenuButton
        className={cn(" flex gap-1 py-0 !pr-0 h-5.5 relative", isOnPage && "pl-7")}

        onClick={goToFav}>
        {!isOnPage &&
          <ExternalLink />
        }
        <FavChatIcon />

        <span className="text-xs truncate"
        >
          {favChat.preview}

        </span>

        <div
          className="absolute top-0 h-full right-0 bg-accent gap-2 flex"

        >
          <div
            className={
              buttonVariants(
                {
                  variant: "ghost",
                  size: "sm",
                  className: "cursor-pointer h-full !px-0",
                }
              )
            }
            onClick={() => removeFav(uniqueKey)}
          >
            <StarIcon className="h-full" fill="black" />

          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}