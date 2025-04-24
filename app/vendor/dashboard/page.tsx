"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ShoppingCart, MessageSquare, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { VendorSidebar } from "@/components/vendor/sidebar"

export default function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useVendorAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push("/vendor/login")
    }
  }, [isMounted, isAuthenticated, isLoading, router])

  // 로딩 중이거나 인증되지 않은 경우
  if (!isMounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  // 대시보드 통계 데이터 (실제로는 API에서 가져와야 함)
  const stats = [
    {
      title: "신규 견적 요청",
      value: "12",
      description: "오늘 3건 추가",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      title: "진행 중인 주문",
      value: "28",
      description: "배송 대기 8건",
      icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
      color: "bg-green-50",
    },
    {
      title: "새 메시지",
      value: "5",
      description: "읽지 않은 메시지",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      title: "이번 달 매출",
      value: "₩ 8,245,000",
      description: "전월 대비 12% 증가",
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-50",
    },
  ]

  // 최근 알림 데이터 (실제로는 API에서 가져와야 함)
  const notifications = [
    {
      id: 1,
      title: "새로운 견적 요청",
      description: "스마트폰 케이스 300개에 대한 견적 요청이 도착했습니다.",
      time: "10분 전",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 2,
      title: "주문 확정",
      description: "주문 #ORD-2023-0458이 확정되었습니다.",
      time: "1시간 전",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    },
    {
      id: 3,
      title: "배송 지연",
      description: "주문 #ORD-2023-0412의 배송이 지연되고 있습니다.",
      time: "3시간 전",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    {
      id: 4,
      title: "견적 만료 예정",
      description: "3건의 견적이 24시간 내에 만료될 예정입니다.",
      time: "5시간 전",
      icon: <Clock className="h-5 w-5 text-orange-500" />,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">판매자 대시보드</h1>
            <p className="text-muted-foreground">
              안녕하세요, {user?.name}님! {user?.companyName}의 현황을 확인하세요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>최근 알림</CardTitle>
                <CardDescription>최근 24시간 동안의 중요 알림</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4">
                      <div className="bg-gray-100 p-2 rounded-full">{notification.icon}</div>
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
                <CardDescription>자주 사용하는 기능에 빠르게 접근하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "견적 작성", icon: <FileText className="h-5 w-5" />, href: "/vendor/quotes/new" },
                    { title: "주문 확인", icon: <ShoppingCart className="h-5 w-5" />, href: "/vendor/orders" },
                    { title: "채팅 확인", icon: <MessageSquare className="h-5 w-5" />, href: "/vendor/chats" },
                    { title: "매출 보고서", icon: <TrendingUp className="h-5 w-5" />, href: "/vendor/sales" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => router.push(item.href)}
                    >
                      {item.icon}
                      <span className="mt-2 text-sm font-medium">{item.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
