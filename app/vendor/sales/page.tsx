"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, Download, TrendingUp, DollarSign, ShoppingCart } from "lucide-react"
import { LineChart, BarChart } from "@/components/ui/charts"

// 매출 데이터 타입 정의
type SalesData = {
  date: string
  revenue: number
  orders: number
}

// 임시 매출 데이터
const mockDailySales: SalesData[] = [
  { date: "2023-05-01", revenue: 1250000, orders: 12 },
  { date: "2023-05-02", revenue: 980000, orders: 9 },
  { date: "2023-05-03", revenue: 1450000, orders: 15 },
  { date: "2023-05-04", revenue: 1320000, orders: 13 },
  { date: "2023-05-05", revenue: 1680000, orders: 17 },
  { date: "2023-05-06", revenue: 1100000, orders: 11 },
  { date: "2023-05-07", revenue: 950000, orders: 8 },
]

const mockWeeklySales: SalesData[] = [
  { date: "2023-W18", revenue: 7850000, orders: 78 },
  { date: "2023-W19", revenue: 8250000, orders: 82 },
  { date: "2023-W20", revenue: 9150000, orders: 91 },
  { date: "2023-W21", revenue: 8750000, orders: 87 },
  { date: "2023-W22", revenue: 9450000, orders: 94 },
  { date: "2023-W23", revenue: 10250000, orders: 102 },
  { date: "2023-W24", revenue: 9850000, orders: 98 },
]

const mockMonthlySales: SalesData[] = [
  { date: "2022-12", revenue: 32500000, orders: 325 },
  { date: "2023-01", revenue: 28750000, orders: 287 },
  { date: "2023-02", revenue: 31250000, orders: 312 },
  { date: "2023-03", revenue: 35750000, orders: 357 },
  { date: "2023-04", revenue: 38250000, orders: 382 },
  { date: "2023-05", revenue: 41500000, orders: 415 },
]

// 제품별 매출 데이터
const mockProductSales = [
  { name: "스마트폰 케이스", revenue: 12500000, orders: 250 },
  { name: "블루투스 이어폰", revenue: 9800000, orders: 120 },
  { name: "티셔츠", revenue: 8500000, orders: 340 },
  { name: "LED 조명", revenue: 7200000, orders: 180 },
  { name: "스마트워치", revenue: 6500000, orders: 65 },
]

// 지역별 매출 데이터
const mockRegionSales = [
  { name: "서울", revenue: 18500000, orders: 370 },
  { name: "부산", revenue: 9200000, orders: 184 },
  { name: "인천", revenue: 7800000, orders: 156 },
  { name: "대구", revenue: 6500000, orders: 130 },
  { name: "광주", revenue: 5200000, orders: 104 },
]

export default function VendorSalesPage() {
  const [period, setPeriod] = useState("daily")
  const [date, setDate] = useState<Date | undefined>(new Date())

  // 기간별 데이터 선택
  const salesData = period === "daily" ? mockDailySales : period === "weekly" ? mockWeeklySales : mockMonthlySales

  // 차트 데이터 포맷팅
  const revenueChartData = {
    labels: salesData.map((d) => d.date),
    datasets: [
      {
        label: "매출",
        data: salesData.map((d) => d.revenue),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "rgba(var(--primary), 0.1)",
        tension: 0.3,
      },
    ],
  }

  const ordersChartData = {
    labels: salesData.map((d) => d.date),
    datasets: [
      {
        label: "주문 수",
        data: salesData.map((d) => d.orders),
        backgroundColor: "hsl(var(--primary))",
      },
    ],
  }

  const productChartData = {
    labels: mockProductSales.map((d) => d.name),
    datasets: [
      {
        label: "제품별 매출",
        data: mockProductSales.map((d) => d.revenue),
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(var(--accent))",
          "hsl(var(--destructive))",
          "hsl(var(--muted))",
        ],
      },
    ],
  }

  const regionChartData = {
    labels: mockRegionSales.map((d) => d.name),
    datasets: [
      {
        label: "지역별 매출",
        data: mockRegionSales.map((d) => d.revenue),
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(var(--accent))",
          "hsl(var(--destructive))",
          "hsl(var(--muted))",
        ],
      },
    ],
  }

  // 총 매출 계산
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0)
  const averageOrderValue = totalRevenue / totalOrders

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">매출 관리</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">일별</SelectItem>
              <SelectItem value="weekly">주별</SelectItem>
              <SelectItem value="monthly">월별</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ko }) : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ko} />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            보고서 다운로드
          </Button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(totalRevenue)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              전월 대비 <span className="text-green-500">+12.5%</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 주문 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{totalOrders.toLocaleString()}건</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              전월 대비 <span className="text-green-500">+8.3%</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">평균 주문 금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(averageOrderValue)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              전월 대비 <span className="text-green-500">+3.8%</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 */}
      <Tabs defaultValue="revenue" className="mb-6">
        <TabsList>
          <TabsTrigger value="revenue">매출 추이</TabsTrigger>
          <TabsTrigger value="orders">주문 추이</TabsTrigger>
          <TabsTrigger value="products">제품별 매출</TabsTrigger>
          <TabsTrigger value="regions">지역별 매출</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>매출 추이</CardTitle>
              <CardDescription>
                {period === "daily" ? "일별" : period === "weekly" ? "주별" : "월별"} 매출 추이를 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <LineChart data={revenueChartData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>주문 추이</CardTitle>
              <CardDescription>
                {period === "daily" ? "일별" : period === "weekly" ? "주별" : "월별"} 주문 수 추이를 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <BarChart data={ordersChartData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>제품별 매출</CardTitle>
              <CardDescription>제품별 매출 분포를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <BarChart data={productChartData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>지역별 매출</CardTitle>
              <CardDescription>지역별 매출 분포를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <BarChart data={regionChartData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 베스트셀러 제품 */}
      <Card>
        <CardHeader>
          <CardTitle>베스트셀러 제품</CardTitle>
          <CardDescription>가장 많이 판매된 제품 목록입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">제품명</th>
                  <th className="text-right py-3 px-4">판매량</th>
                  <th className="text-right py-3 px-4">매출</th>
                  <th className="text-right py-3 px-4">평균 단가</th>
                </tr>
              </thead>
              <tbody>
                {mockProductSales.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="text-right py-3 px-4">{product.orders.toLocaleString()}개</td>
                    <td className="text-right py-3 px-4">
                      {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(product.revenue)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
                        product.revenue / product.orders,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
