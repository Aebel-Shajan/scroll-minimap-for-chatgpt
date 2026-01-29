import { Button } from "@/components/ui/button";
import { favouritedChat } from "@/types";
import { Copy, Download, ExternalLink, Trash } from "lucide-react";
import { ICON_MAP } from "@/lib/chatgptElementUtils";
import { cn } from "@/lib/utils";
import useChatProvider from "@/hooks/use-chat-provider";
import { toast } from "sonner";

export default function AllFavouritesList({
  favourites,
  setFavourites,
  onClose
}: {
  favourites: Record<string, favouritedChat>,
  setFavourites: CallableFunction,
  onClose: () => void
}) {
  const chatProvider = useChatProvider()

  const exportToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(favourites, null, 2))
    toast.success("Copied to clipboard")
  }

  const exportToFile = () => {
    const blob = new Blob([JSON.stringify(favourites, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-gps-favourites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Exported to file")
  }

  const removeFavourite = (uniqueId: string) => {
      setFavourites((old: Record<string, favouritedChat>) => {
        const newFavs = { ...old }
        delete newFavs[uniqueId]
        return newFavs
      })
  }

  // Group favourites by chatId
  const groupedFavourites: Record<string, { favs: { id: string, data: favouritedChat }[] }> = {}
  Object.entries(favourites).forEach(([key, value]) => {
      if (!groupedFavourites[value.chatId]) {
          groupedFavourites[value.chatId] = { favs: [] }
      }
      groupedFavourites[value.chatId].favs.push({ id: key, data: value })
  })

  const getChatUrl = (chatId: string, fav: favouritedChat) => {
      if (fav.url) return fav.url;
      // Fallback for legacy items (assume chatgpt)
      return `https://chat.com/c/${chatId}`;
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex justify-between items-center p-2 border-b">
        <h2 className="font-bold">All Favourites</h2>
        <div className="flex gap-1">
             <Button size="sm" variant="outline" onClick={exportToClipboard} title="Copy to Clipboard">
                <Copy size={14} />
             </Button>
             <Button size="sm" variant="outline" onClick={exportToFile} title="Export to JSON">
                <Download size={14} />
             </Button>
             <Button size="sm" variant="ghost" onClick={onClose}>Back</Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
         {Object.keys(groupedFavourites).length === 0 ? (
             <div className="text-center text-muted-foreground p-4">No favourites yet.</div>
         ) : (
             Object.entries(groupedFavourites).map(([chatId, { favs }]) => {
                 // Use the first fav to guess the URL if possible, or just link to the generic chat
                 const firstFav = favs[0].data;
                 const chatUrl = getChatUrl(chatId, firstFav);

                 return (
                 <div key={chatId} className="mb-4 border rounded-md overflow-hidden">
                     <div className="bg-muted p-2 text-xs font-semibold break-all border-b flex justify-between items-center">
                        <span>Chat ID: {chatId}</span>
                        <a href={chatUrl} target="_blank" className="hover:text-primary">
                            <ExternalLink size={12} />
                        </a>
                     </div>
                     <div className="flex flex-col">
                         {favs.map(({ id, data }) => (
                             <div key={id} className="p-2 border-b last:border-b-0 flex items-center justify-between gap-2 hover:bg-muted/50">
                                 <div className="flex items-center gap-2 overflow-hidden">
                                     {ICON_MAP[data.iconName] ?
                                        (() => { const Icon = ICON_MAP[data.iconName]; return <Icon size={14} className="shrink-0"/> })()
                                        : null
                                     }
                                     <span className="text-xs truncate">{data.preview}</span>
                                 </div>
                                 <div className="flex gap-1 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                        onClick={() => removeFavourite(id)}
                                    >
                                        <Trash size={12} />
                                    </Button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )})
         )}
      </div>
    </div>
  )
}
