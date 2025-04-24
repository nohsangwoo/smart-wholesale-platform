"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useVendorAuth } from "@/context/vendor-auth-context"
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Truck,
  MessageSquare,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isActive: boolean
  isCollapsed: boolean
  badge?: number
}

function SidebarItem({ icon, label, href, isActive, isCollapsed, badge }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {!isCollapsed && (
        <div className="flex-1 flex items-center justify-between">
          <span>{label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {badge}
            </Badge>
          )}
        </div>
      )}
      {isCollapsed && badge !== undefined && badge > 0 && (
        <Badge variant="secondary" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Link>
  )
}

export function VendorSidebar() {
  const { vendor, logout } = useVendorAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/vendor/login")
  }

  // 모의 알림 데이터
  const notifications = {
    quotes: 5,
    orders: 2,
    messages: 3,
  }

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "대시보드",
      href: "/vendor/dashboard",
      badge: undefined,
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "견적 관리",
      href: "/vendor/quotes",
      badge: notifications.quotes,
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "주문 관리",
      href: "/vendor/orders",
      badge: notifications.orders,
    },
    {
      icon: <Truck className="h-5 w-5" />,
      label: "배송 관리",
      href: "/vendor/shipping",
      badge: undefined,
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "채팅 관리",
      href: "/vendor/chats",
      badge: notifications.messages,
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "매출 관리",
      href: "/vendor/sales",
      badge: undefined,
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "리뷰 관리",
      href: "/vendor/reviews",
      badge: undefined,
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "설정",
      href: "/vendor/settings",
      badge: undefined,
    },
  ]

  return (
    <div className={`border-r bg-background transition-all duration-300 ${isCollapsed ? "w-[70px]" : "w-[240px]"}`}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-3">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              {vendor?.profileImage && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={vendor.profileImage || "/placeholder.svg"}
                    alt={vendor.companyName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h2 className="text-sm font-semibold truncate">{vendor?.companyName || "업체 페이지"}</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`${isCollapsed ? "mx-auto" : "ml-auto"} h-8 w-8`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
                badge={item.badge}
              />
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-2">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{vendor?.name}</p>
              <p className="text-xs text-muted-foreground">{vendor?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className={`w-full justify-start text-muted-foreground hover:text-foreground ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!isCollapsed && "로그아웃"}
          </Button>
        </div>
      </div>
    </div>
  )
}
