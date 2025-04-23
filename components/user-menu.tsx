"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, ShoppingBag, Settings, Heart, Share2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setOpen(false)
    router.push("/")
  }

  if (!user) return null

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "사용자"

  return (
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
  )
}
