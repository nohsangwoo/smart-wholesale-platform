"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { TrendingUp, Star, ArrowRight, Clock, CheckCircle, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockOrderDetails } from "@/lib/mock-data"
import { generateMockQuotes } from "@/lib/mock-vendors"

// 차트 컴포넌트 (간단한 막대 그래프)
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function VendorDashboardPage() {
  const { vendor } = useVendorAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    unreadMessages: 0,
  })

  const [salesData, setSalesData] = useState<{ label: string; value: number }[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentQuotes, setRecentQuotes] = useState<any[]>([])

  useEffect(() => {
    // 모의 데이터 로드
    loadMockData()
  }, [])

  const loadMockData = () => {
    // 모의 주문 데이터 (업체 ID가 vendor-1인 주문만 필터링)
    const vendorOrders = mockOrderDetails.filter((order) => {
      // 실제로는 주문에 업체 ID가 있어야 하지만, 모의 데이터에서는 임의로 처리
      return Math.random() > 0.5 // 50% 확률로 이 업체의 주문으로 간주
    })

    // 모의 견적 데이터 생성
    const allQuotes = mockOrderDetails.flatMap((order) => {
      try {
        return generateMockQuotes(order.id, order.product.originalPrice)
      } catch (error) {
        console.error("Error generating quotes for order:", order.id, error)
        return []
      }
    })

    // 이 업체의 견적만 필터링
    const vendorQuotes = allQuotes.filter((quote) => quote.vendorId === "vendor-1")

    // 통계 데이터 계산
    const totalOrders = vendorOrders.length
    const pendingOrders = vendorOrders.filter(
      (order) => order.status === "배송 준비중" || order.status === "배송중",
    ).length
    const totalSales = vendorOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const pendingQuotes = 5 // 모의 데이터
    const acceptedQuotes = 12 // 모의 데이터
    const unreadMessages = 3 // 모의 데이터

    setStats({
      totalOrders,
      pendingOrders,
      totalSales,
      pendingQuotes,
      acceptedQuotes,
      unreadMessages,
    })

    // 매출 데이터 (최근 6개월)
    setSalesData([
      { label: "1월", value: 1250000 },
      { label: "2월", value: 1820000 },
      { label: "3월", value: 1590000 },
      { label: "4월", value: 2160000 },
      { label: "5월", value: 2520000 },
      { label: "6월", value: 2180000 },
    ])

    // 최근 주문 5개
    setRecentOrders(vendorOrders.slice(0, 5))

    // 최근 견적 요청 5개
    setRecentQuotes(vendorQuotes.slice(0, 5))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "배송 준비중":
        return <Badge variant="default">배송 준비중</Badge>
      case "배송중":
        return <Badge variant="secondary">배송중</Badge>
      case "배송 완료":
        return <Badge variant="success">배송 완료</Badge>
      case "관리자 승인 대기":
        return <Badge variant="warning">승인 대기</Badge>
      case "결제 대기":
        return <Badge variant="outline">결제 대기</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">업체 대시보드</h1>
        <div className="flex items-center gap-2">
          <Badge variant={vendor?.premium ? "default" : "outline"} className="text-xs">
            {vendor?.premium ? "프리미엄 업체" : "일반 업체"}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="ml-1 text-sm font-medium">{vendor?.rating || 0}</span>
            <span className="ml-1 text-xs text-muted-foreground">({vendor?.reviewCount || 0})</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">진행 중: {stats.pendingOrders}건</p>
            <div className="mt-2">
              <Progress value={(stats.pendingOrders / Math.max(stats.totalOrders, 1)) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalSales / 10000).toFixed(1)}만원</div>
            <p className="text-xs text-muted-foreground mt-1">전월 대비 8.5% 증가</p>
            <div className="mt-2">
              <Progress value={85} className="h-1" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">견적 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuotes + stats.acceptedQuotes}</div>
            <p className="text-xs text-muted-foreground mt-1">대기 중: {stats.pendingQuotes}건</p>
            <div className="mt-2">
              <Progress
                value={(stats.pendingQuotes / Math.max(stats.pendingQuotes + stats.acceptedQuotes, 1)) * 100}
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">미확인 메시지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">새로운 문의</p>
            <div className="mt-2">
              <Progress value={stats.unreadMessages > 0 ? 100 : 0} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">주문 현황</TabsTrigger>
          <TabsTrigger value="quotes">견적 현황</TabsTrigger>
          <TabsTrigger value="sales">매출 현황</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>최근 주문</CardTitle>
              <CardDescription>최근 5개 주문 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">주문 내역이 없습니다.</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">
                          {order.product.title.length > 20
                            ? `${order.product.title.substring(0, 20)}...`
                            : order.product.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.totalAmount.toLocaleString()}원</p>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 text-right">
                <Button variant="link" size="sm" asChild>
                  <a href="/vendor/orders">
                    모든 주문 보기
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>견적 요청</CardTitle>
              <CardDescription>최근 견적 요청 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuotes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">견적 요청이 없습니다.</p>
                ) : (
                  recentQuotes.map((quote) => (
                    <div
                      key={quote.vendorId + quote.orderId}
                      className="flex justify-between items-center border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">주문 ID: {quote.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{quote.price.toLocaleString()}원</p>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          대기 중
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 text-right">
                <Button variant="link" size="sm" asChild>
                  <a href="/vendor/quotes">
                    모든 견적 보기
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 현황</CardTitle>
              <CardDescription>최근 6개월 매출 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={salesData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>주문 처리 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>결제 대기</span>
                </div>
                <Badge variant="outline">{Math.floor(Math.random() * 5)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>배송 준비중</span>
                </div>
                <Badge variant="outline">{Math.floor(Math.random() * 10)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>배송중</span>
                </div>
                <Badge variant="outline">{Math.floor(Math.random() * 8)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>배송 완료</span>
                </div>
                <Badge variant="outline">{Math.floor(Math.random() * 50) + 20}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>성과 지표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">견적 수락률</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">68%</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-green-600" style={{ width: "68%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">평균 응답 시간</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">30분</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-green-600" style={{ width: "85%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">고객 만족도</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">4.8/5</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-green-600" style={{ width: "96%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
