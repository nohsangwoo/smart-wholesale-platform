"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Settings, Store } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <div className="flex-1 flex justify-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              관리자 페이지
            </Button>
          </Link>
          <Link href="/vendor/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <Store className="h-4 w-4" />
              판매자 페이지
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/mypage/wishlist">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">찜 목록</span>
                </Button>
              </Link>
              <Link href="/mypage/shared">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">공유 내역</span>
                </Button>
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
