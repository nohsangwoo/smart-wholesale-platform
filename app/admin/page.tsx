"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCard } from "@/components/admin/stats-card"
import { ShoppingCart, Users, DollarSign, Package, TrendingUp, MessageSquare, Heart, Share2 } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    activeUsers: 0,
    pendingInquiries: 0,
    totalProducts: 0,
    totalWishlists: 0,
    totalShares: 0,
  })

  const [salesData, setSalesData] = useState<{ label: string; value: number }[]>([])
  const [productData, setProductData] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    // 통계 데이터 계산 (모킹)
    const totalOrders = mockOrders.length
    const pendingOrders = mockOrders.filter(
      (order) => order.status === "관리자 승인 대기" || order.status === "결제 대기",
    ).length
    const totalSales = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const activeUsers = 128 // 모킹된 값
    const pendingInquiries = 15 // 모킹된 값
    const totalProducts = 120 // 모킹된 값
    const totalWishlists = 87 // 모킹된 값
    const totalShares = 45 // 모킹된 값

    setStats({
      totalOrders,
      pendingOrders,
      totalSales,
      activeUsers,
      pendingInquiries,
      totalProducts,
      totalWishlists,
      totalShares,
    })

    // 매출 데이터 (최근 6개월)
    setSalesData([
      { label: "1월", value: 2450000 },
      { label: "2월", value: 3120000 },
      { label: "3월", value: 2890000 },
      { label: "4월", value: 3560000 },
      { label: "5월", value: 4120000 },
      { label: "6월", value: 3980000 },
    ])

    // 인기 상품 데이터
    setProductData([
      { label: "스마트폰 케이스", value: 42 },
      { label: "LED 스마트 조명", value: 38 },
      { label: "블루투스 이어폰", value: 35 },
      { label: "스마트 워치", value: 30 },
      { label: "캐주얼 티셔츠", value: 25 },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-sm text-muted-foreground">최근 업데이트: {new Date().toLocaleString()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 주문"
          value={stats.totalOrders}
          description="전월 대비"
          icon={<ShoppingCart className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="총 매출"
          value={`${(stats.totalSales / 10000).toFixed(1)}만원`}
          description="전월 대비"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 8.5, isPositive: true }}
        />
        <StatsCard
          title="활성 사용자"
          value={stats.activeUsers}
          description="지난 30일"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="승인 대기 주문"
          value={stats.pendingOrders}
          description="처리 필요"
          icon={<Package className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="미답변 문의"
          value={stats.pendingInquiries}
          description="답변 필요"
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatsCard
          title="등록 상품"
          value={stats.totalProducts}
          description="전월 대비"
          icon={<Package className="h-4 w-4" />}
          trend={{ value: 3.8, isPositive: true }}
        />
        <StatsCard
          title="찜 목록 수"
          value={stats.totalWishlists}
          description="전월 대비"
          icon={<Heart className="h-4 w-4" />}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          title="공유 횟수"
          value={stats.totalShares}
          description="전월 대비"
          icon={<Share2 className="h-4 w-4" />}
          trend={{ value: 7.2, isPositive: true }}
        />
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">매출 현황</TabsTrigger>
          <TabsTrigger value="products">인기 상품</TabsTrigger>
        </TabsList>
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
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>인기 상품 순위</CardTitle>
              <CardDescription>주문 횟수 기준</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={productData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
            <CardDescription>최근 5개 주문 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">
                      {order.productTitle.length > 20
                        ? `${order.productTitle.substring(0, 20)}...`
                        : order.productTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.totalAmount.toLocaleString()}원</p>
                    <p className="text-xs px-2 py-0.5 rounded-full bg-muted inline-block">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>성과 지표</CardTitle>
            <CardDescription>주요 비즈니스 지표</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">전환율</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">4.8%</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-green-600" style={{ width: "48%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">평균 주문 금액</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">580,000원</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-green-600" style={{ width: "65%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">재구매율</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">32%</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-green-600" style={{ width: "32%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
