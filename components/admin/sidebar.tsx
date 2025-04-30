"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAdminAuth } from "@/context/admin-auth-context"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Store,
  FileCheck,
} from "lucide-react"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isActive: boolean
  isCollapsed: boolean
}

function SidebarItem({ icon, label, href, isActive, isCollapsed }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

export function AdminSidebar() {
  const { admin, logout } = useAdminAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "대시보드",
      href: "/admin",
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "주문 관리",
      href: "/admin/orders",
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "견적 관리",
      href: "/admin/products",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "사용자 관리",
      href: "/admin/users",
    },
    {
      icon: <Store className="h-5 w-5" />,
      label: "판매자 관리",
      href: "/admin/vendors",
    },
    {
      icon: <FileCheck className="h-5 w-5" />,
      label: "가입 심사",
      href: "/admin/applications",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "문의 관리",
      href: "/admin/inquiries",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "찜 목록 분석",
      href: "/admin/wishlist",
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      label: "공유 통계",
      href: "/admin/shares",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "설정",
      href: "/admin/settings",
    },
  ]

  return (
    <div className={`border-r bg-background transition-all duration-300 ${isCollapsed ? "w-[70px]" : "w-[240px]"}`}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-3">
          {!isCollapsed && <h2 className="text-lg font-semibold">관리자 페이지</h2>}
          <Button
            variant="ghost"
            size="icon"
            className={`ml-auto h-8 w-8 ${isCollapsed ? "mx-auto" : ""}`}
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
              />
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-2">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{admin?.name}</p>
              <p className="text-xs text-muted-foreground">{admin?.email}</p>
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
