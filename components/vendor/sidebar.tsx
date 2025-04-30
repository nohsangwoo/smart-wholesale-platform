"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
  Store,
  FileSearch,
  Crown,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function VendorSidebar() {
  const pathname = usePathname()
  const { user, logout } = useVendorAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/vendor/login")
  }

  const menuItems = [
    {
      title: "판매자 프리미엄 신청",
      href: "/vendor/premium",
      icon: <Crown className="h-5 w-5" />,
      highlight: true,
    },
    {
      title: "대시보드",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/vendor/dashboard",
    },
    {
      title: "견적 요청 목록",
      icon: <FileSearch className="h-5 w-5" />,
      href: "/vendor/quotes-list",
    },
    {
      title: "견적 관리",
      icon: <FileText className="h-5 w-5" />,
      href: "/vendor/quotes",
    },
    {
      title: "주문 관리",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/vendor/orders",
    },
    {
      title: "채팅",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/vendor/chats",
    },
    {
      title: "매출 관리",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/vendor/sales",
    },
    {
      title: "설정",
      icon: <Settings className="h-5 w-5" />,
      href: "/vendor/settings",
    },
  ]

  return (
    <div className="flex flex-col w-64 bg-white border-r min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Store className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">판매자 포털</h1>
      </div>

      {user && (
        <div className="flex items-center gap-3 p-3 mb-6 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage || "/placeholder.svg"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-primary">{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.companyName}</p>
          </div>
        </div>
      )}

      <nav className="space-y-1 flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === item.href ? "bg-gray-100 text-gray-900" : "",
              item.highlight ? "bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800" : "",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="pt-4 mt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">로그아웃</span>
        </Button>
      </div>
    </div>
  )
}
