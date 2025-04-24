"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { VendorSidebar } from "@/components/vendor/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Truck, CheckCircle, Package, Clock } from "lucide-react"

export default function VendorOrdersPage() {
  const { isAuthenticated, isLoading } = useVendorAuth()
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

  // 모의 주문 데이터
  const orders = [
    {
      id: "ORD-2023-001",
      productName: "스마트폰 케이스 (iPhone 14 Pro)",
      quantity: 500,
      status: "pending",
      orderDate: "2023-06-15",
      customerName: "김철수",
      totalAmount: 4500000,
      shippingAddress: "서울시 강남구 테헤란로 123",
    },
    {
      id: "ORD-2023-002",
      productName: "블루투스 이어폰",
      quantity: 200,
      status: "processing",
      orderDate: "2023-06-10",
      customerName: "이영희",
      totalAmount: 6000000,
      shippingAddress: "서울시 서초구 서초대로 456",
    },
    {
      id: "ORD-2023-003",
      productName: "보조배터리 10000mAh",
      quantity: 300,
      status: "shipped",
      orderDate: "2023-06-05",
      customerName: "박지민",
      totalAmount: 3750000,
      shippingAddress: "경기도 성남시 분당구 판교로 789",
    },
    {
      id: "ORD-2023-004",
      productName: "노트북 파우치 15인치",
      quantity: 150,
      status: "delivered",
      orderDate: "2023-05-28",
      customerName: "최수진",
      totalAmount: 2250000,
      shippingAddress: "인천시 연수구 송도동 123-45",
    },
    {
      id: "ORD-2023-005",
      productName: "무선 충전기",
      quantity: 400,
      status: "pending",
      orderDate: "2023-06-14",
      customerName: "정민수",
      totalAmount: 5200000,
      shippingAddress: "부산시 해운대구 해운대로 678",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>결제 대기</span>
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800">
            <Package className="h-3 w-3" />
            <span>배송 준비중</span>
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800">
            <Truck className="h-3 w-3" />
            <span>배송중</span>
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            <span>배송 완료</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">주문 관리</h1>
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              주문 내보내기
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="주문 ID, 상품명, 고객명으로 검색..." className="pl-8" />
            </div>
            <Button variant="outline">필터</Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="pending">결제 대기</TabsTrigger>
              <TabsTrigger value="processing">배송 준비중</TabsTrigger>
              <TabsTrigger value="shipped">배송중</TabsTrigger>
              <TabsTrigger value="delivered">배송 완료</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>모든 주문</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            주문 ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상품 정보
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            고객명
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            금액
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상태
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            주문일
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                <p className="font-medium">{order.productName}</p>
                                <p className="text-xs text-gray-500">수량: {order.quantity}개</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.totalAmount.toLocaleString()}원
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/vendor/orders/${order.id}`)}
                              >
                                상세보기
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 다른 탭 콘텐츠도 유사한 구조로 구현 */}
            <TabsContent value="pending" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>결제 대기 주문</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      {/* 테이블 헤더 및 본문 구조는 위와 동일 */}
                      <thead className="bg-gray-50">
                        {/* 헤더 내용 */}
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            주문 ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상품 정보
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            고객명
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            금액
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상태
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            주문일
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders
                          .filter((o) => o.status === "pending")
                          .map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  <p className="font-medium">{order.productName}</p>
                                  <p className="text-xs text-gray-500">수량: {order.quantity}개</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.totalAmount.toLocaleString()}원
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getStatusBadge(order.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/vendor/orders/${order.id}`)}
                                >
                                  상세보기
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
