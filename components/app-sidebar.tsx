import * as React from "react"
import { Bot, BotMessageSquare, ChevronRight, CircleSmall, Code, File, Folder, MessageSquare, Section, User } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import { HTMLElementItem } from "@/types"
import { getChatAuthor, getScrollableParent } from "@/lib/chatgptElementUtils"

// This is sample data.
const data = {
  changes: [
    {
      file: "README.md",
      state: "M",
    },
    {
      file: "api/hello/route.ts",
      state: "U",
    },
    {
      file: "app/layout.tsx",
      state: "M",
    },
  ],
  tree: [
    [
      "app",
      [
        "api",
        ["hello", ["route.ts"]],
        "page.tsx",
        "layout.tsx",
        ["blog", ["page.tsx"]],
      ],
    ],
    [
      "components",
      ["ui", "button.tsx", "card.tsx"],
      "header.tsx",
      "footer.tsx",
    ],
    ["lib", ["util.ts"]],
    ["public", "favicon.ico", "vercel.svg"],
    ".eslintrc.json",
    ".gitignore",
    "next.config.js",
    "tailwind.config.js",
    "package.json",
    "README.md",
  ],
}




export function AppSidebar({ treeItems, ...props }: React.ComponentProps<typeof Sidebar> & { treeItems: HTMLElementItem[] }) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.changes.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton>
                    <File />
                    {item.file}
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{item.state}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {treeItems.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}



const ICON_MAP = {
  "user": User,
  "assistant": BotMessageSquare,
  "code": Code,
  "section": Section,
  "chat": MessageSquare,
}

function getItemIcon(item: HTMLElementItem) {
  const element = item.element
  if (element.matches('[data-testid^="conversation-turn-"]')) {
    return ICON_MAP[getChatAuthor(element)]
  }
  if (element.tagName === "PRE") return ICON_MAP["code"]
  if (element.matches("h1, h2, h3")) return ICON_MAP["section"]
  return ICON_MAP["chat"]
}

function Tree({ item }: { item: HTMLElementItem }) {
  const label = item.element.innerText
  const children = item.children
  const ItemIcon = getItemIcon(item)

  function scrollElementIntoView() {

    // why not use chatElement.scrollIntoView()?
    const scrollContainer = getScrollableParent(item.element)
    if (scrollContainer) {
      console.log(item.element)
      scrollContainer.scrollTop = item.element.getBoundingClientRect().top + scrollContainer.scrollTop - 60
    }
  }


  if (!children.length) {
    return (
      <SidebarMenuButton
        // isActive={name === "button.tsx"}
        className="data-[active=true]:bg-transparent grid grid-cols-12"
        onClick={scrollElementIntoView}
      >
        <div className="col-span-1" />
        <ItemIcon className="col-span-1" />
        <span className="col-span-10">
          {label}
        </span>
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      // defaultOpen={name === "components" || name === "ui"}
      >
        <SidebarMenuButton className="grid grid-cols-12 gap-1">
          <CollapsibleTrigger asChild>
            <ChevronRight className="transition-transform col-span-1" />
          </CollapsibleTrigger>
          <ItemIcon className="col-span-1" />
          <span className="col-span-10"
            onClick={scrollElementIntoView}


          >
            {label}
          </span>
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
