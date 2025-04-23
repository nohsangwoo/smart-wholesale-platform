"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminAuthProvider, useAdminAuth } from "@/context/admin-auth-context"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Loader2 } from "lucide-react"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading) {
      // 로그인 페이지가 아니고 인증되지 않은 경우 로그인 페이지로 리다이렉트
      if (!isAuthenticated && pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, isMounted])

  // 로딩 중이거나 마운트되지 않은 경우 로딩 표시
  if (isLoading || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // 로그인 페이지인 경우 사이드바 없이 렌더링
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // 인증되지 않은 경우 아무것도 렌더링하지 않음 (리다이렉트 처리됨)
  if (!isAuthenticated) {
    return null
  }

  // 인증된 경우 관리자 레이아웃 렌더링
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster />
    </AdminAuthProvider>
  )
}
