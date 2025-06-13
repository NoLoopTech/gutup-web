"use client"

import {
  Inbox,
  ChevronDown,
  GalleryVerticalEnd,
  LogOut,
  Bell,
  BadgeCheck,
  UserRound,
  Ham,
  HandPlatter,
  ShoppingBasket,
  ClipboardPenLine
} from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@radix-ui/react-collapsible"
import { Button } from "../ui/button"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "../ui/label"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function AppSidebar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const handleSignOut = async (): Promise<void> => {
    await signOut()
  }

  return (
    <Sidebar>
      {/* Sidebar header  */}
      <SidebarHeader className="p-4 ">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-white bg-black rounded-lg">
              <GalleryVerticalEnd className="w-5 h-5" />
            </div>
            <div className="flex flex-col ">
              <Label className="text-sm font-semibold leading-tight">
                GutUp
              </Label>
              <Label className="text-xs text-muted-foreground">
                Admin Panel
              </Label>
            </div>
          </div>

          <div className="lg:hidden">
            <SidebarTrigger className="w-10 h-10 " closeIcon />
          </div>
        </div>
      </SidebarHeader>

      {/* sidebar contents  */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* not available for now */}
              {/* Dashboard */}
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Inbox className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}

              {/* User Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/user-management"
                    className="flex items-center gap-2"
                  >
                    <UserRound className="w-4 h-4" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Collapsible: Food Management */}
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-2">
                        <Ham className="w-4 h-4" />
                        <span>Food Management</span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pl-6">
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link href="/food-management/food-overview">
                            Food Overview
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link href="/food-management/tag-overview">
                            Tag Overview
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Recipe Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/recipe-management"
                    className="flex items-center gap-2"
                  >
                    <HandPlatter className="w-4 h-4" />
                    <span>Recipe Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Store Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/store-management"
                    className="flex items-center gap-2"
                  >
                    <ShoppingBasket className="w-4 h-4" />
                    <span>Store Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Content Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/content-management"
                    className="flex items-center gap-2"
                  >
                    <ClipboardPenLine className="w-4 h-4" />
                    <span>Content Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* sidebar footer  */}
      <SidebarFooter className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-2 py-1.5 hover:bg-accent"
            >
              <Avatar className="w-8 h-8 rounded-lg">
                <AvatarImage
                  src={session?.user?.image || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="text-sm leading-tight text-left">
                <p className="font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          {/* Dropdown Menu Content */}
          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <BadgeCheck className="w-4 h-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="w-4 h-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
