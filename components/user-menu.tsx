"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, ShoppingBag, Settings, Heart, Share2, MessageSquare, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { ChatModal } from "@/components/chat/chat-modal"
import { ChatList } from "@/components/chat/chat-list"

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [isChatListOpen, setIsChatListOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<{
    id: string
    name: string
    avatar?: string
  } | null>(null)

  const handleLogout = () => {
    logout()
    setOpen(false)
    router.push("/")
  }

  const handleOpenChat = (vendor?: { id: string; name: string; avatar?: string }) => {
    if (vendor) {
      setSelectedVendor(vendor)
    } else {
      setSelectedVendor(null)
    }
    setIsChatModalOpen(true)
    setOpen(false)
  }

  const handleOpenChatList = () => {
    setIsChatListOpen(true)
    setOpen(false)
  }

  if (!user) return null

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "사용자"

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name || "사용자"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/mypage" className="cursor-pointer flex w-full">
              <User className="mr-2 h-4 w-4" />내 정보
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/mypage/orders" className="cursor-pointer flex w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />내 주문정보
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/mypage/quotes" className="cursor-pointer flex w-full">
              <FileText className="mr-2 h-4 w-4" />
              견적 요청 내역
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/mypage/wishlist" className="cursor-pointer flex w-full">
              <Heart className="mr-2 h-4 w-4" />
              찜한 상품
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/mypage/shared" className="cursor-pointer flex w-full">
              <Share2 className="mr-2 h-4 w-4" />
              공유 내역
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenChatList} className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            채팅 목록
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/mypage/settings" className="cursor-pointer flex w-full">
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={selectedVendor?.id}
        vendorName={selectedVendor?.name}
        vendorAvatar={selectedVendor?.avatar}
      />

      {/* 채팅 목록 모달 */}
      <ChatList isOpen={isChatListOpen} onClose={() => setIsChatListOpen(false)} onSelectChat={handleOpenChat} />
    </>
  )
}
