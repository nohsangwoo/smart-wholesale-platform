"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, Mail, MapPin, FileText, ShoppingBag, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"

export default function MyPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">내 정보</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>계정 및 개인 정보를 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">이름</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">이메일</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">연락처</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">주소</p>
                    <p className="font-medium">
                      {user.zipCode && `(${user.zipCode})`} {user.address} {user.detailAddress}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-6"
              onClick={() => router.push("/mypage/orders")}
            >
              <ShoppingBag className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">주문 내역</div>
                <div className="text-sm text-muted-foreground">구매한 상품 내역 확인</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-6"
              onClick={() => router.push("/mypage/quotes")}
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">견적 요청 내역</div>
                <div className="text-sm text-muted-foreground">진행 중인 견적 요청 확인</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-6"
              onClick={() => router.push("/mypage/wishlist")}
            >
              <Heart className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">관심 상품</div>
                <div className="text-sm text-muted-foreground">찜한 상품 목록 확인</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-6"
              onClick={() => router.push("/mypage/shared")}
            >
              <Share2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">공유 내역</div>
                <div className="text-sm text-muted-foreground">공유한 상품 목록 확인</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
