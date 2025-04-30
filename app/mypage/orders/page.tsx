"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronRight, Package, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Product {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
}

interface Order {
  id: string
  status: string
  orderDate: string
  totalAmount: number
  isMultiProduct: boolean
  products: Product[]
  trackingNumber?: string
  estimatedDeliveryDate?: string
}

// 모의 주문 데이터 (다중 상품 주문 포함)
const mockOrders: Order[] = [
  {
    id: "order-1",
    status: "배송 완료",
    orderDate: "2023-11-15",
    totalAmount: 585000,
    isMultiProduct: false,
    products: [
      {
        id: "prod-001",
        name: "프리미엄 스마트폰 케이스 도매 (100개 단위)",
        description: "다양한 색상의 아이폰 13 케이스",
        imageUrl: "/bulk-smartphone-cases.png",
        price: 585000,
      },
    ],
    trackingNumber: "KR123456789",
    estimatedDeliveryDate: "2023-11-30",
  },
  {
    id: "order-2",
    status: "배송중",
    orderDate: "2023-12-05",
    totalAmount: 676000,
    isMultiProduct: false,
    products: [
      {
        id: "prod-003",
        name: "LED 스마트 조명 도매 (20개 단위)",
        description: "스마트홈 연동 가능한 LED 조명",
        imageUrl: "/smart-lighting-warehouse.png",
        price: 676000,
      },
    ],
    trackingNumber: "KR987654321",
    estimatedDeliveryDate: "2023-12-20",
  },
  {
    id: "order-3",
    status: "배송 준비중",
    orderDate: "2024-01-20",
    totalAmount: 494000,
    isMultiProduct: false,
    products: [
      {
        id: "prod-002",
        name: "여성용 캐주얼 티셔츠 OEM 생산 (50개 단위)",
        description: "다양한 사이즈와 색상의 여성용 티셔츠",
        imageUrl: "/diverse-casual-tees.png",
        price: 494000,
      },
    ],
  },
  {
    id: "order-4",
    status: "관리자 승인 대기",
    orderDate: "2024-02-10",
    totalAmount: 884000,
    isMultiProduct: false,
    products: [
      {
        id: "prod-004",
        name: "주방용품 세트 OEM 생산 (30세트)",
        description: "스테인리스 스틸 주방용품 세트",
        imageUrl: "/stainless-steel-utensil-display.png",
        price: 884000,
      },
    ],
  },
  {
    id: "order-5",
    status: "결제 대기",
    orderDate: "2024-02-15",
    totalAmount: 1235000,
    isMultiProduct: false,
    products: [
      {
        id: "prod-006",
        name: "블루투스 이어폰 OEM 생산 (100개 단위)",
        description: "노이즈 캔슬링 기능이 있는 블루투스 이어폰",
        imageUrl: "/bulk-bluetooth-earphones.png",
        price: 1235000,
      },
    ],
  },
  {
    id: "order-6",
    status: "배송 완료",
    orderDate: "2024-03-01",
    totalAmount: 9500000,
    isMultiProduct: true,
    products: [
      {
        id: "prod-007",
        name: "무선 충전기 (300개)",
        description: "고속 무선 충전기, 다양한 스마트폰 호환",
        imageUrl: "/wireless-charger.png",
        price: 4200000,
      },
      {
        id: "prod-008",
        name: "보조 배터리 (200개)",
        description: "10,000mAh 이상 고용량 보조 배터리",
        imageUrl: "/portable-power-bank.png",
        price: 3800000,
      },
      {
        id: "prod-009",
        name: "스마트워치 밴드 (500개)",
        description: "다양한 색상의 실리콘 스마트워치 밴드",
        imageUrl: "/smartwatch-band-variety.png",
        price: 1500000,
      },
    ],
    trackingNumber: "KR456789123",
    estimatedDeliveryDate: "2024-03-15",
  },
  {
    id: "order-7",
    status: "배송중",
    orderDate: "2024-03-10",
    totalAmount: 7500000,
    isMultiProduct: true,
    products: [
      {
        id: "prod-010",
        name: "블루투스 스피커 (100개)",
        description: "회의실용 고품질 블루투스 스피커",
        imageUrl: "/bluetooth-speaker.png",
        price: 3500000,
      },
      {
        id: "prod-011",
        name: "사무용 모니터 (50개)",
        description: "27인치 Full HD 모니터",
        imageUrl: "/office-monitor.png",
        price: 4000000,
      },
    ],
    trackingNumber: "KR789123456",
    estimatedDeliveryDate: "2024-03-25",
  },
]

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    // 모의 데이터 로드
    const fetchOrders = async () => {
      try {
        // 실제 API 호출 대신 모의 데이터 사용
        setOrders(mockOrders)
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "주문 내역을 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, isLoading, router, toast])

  // 주문 필터링
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return ["관리자 승인 대기", "결제 대기", "배송 준비중"].includes(order.status)
    if (activeTab === "shipping") return ["배송중"].includes(order.status)
    if (activeTab === "completed") return ["배송 완료"].includes(order.status)
    return true
  })

  // 주문 정렬
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    }
    if (sortBy === "price") {
      return b.totalAmount - a.totalAmount
    }
    return 0
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "배송 준비중":
        return "default"
      case "배송중":
        return "secondary"
      case "배송 완료":
        return "success"
      case "관리자 승인 대기":
        return "warning"
      case "결제 대기":
        return "outline"
      default:
        return "outline"
    }
  }

  if (isLoading || isOrdersLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.push("/mypage")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            내 정보
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">주문 내역</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">내 주문 내역</h1>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="pending">진행중</TabsTrigger>
                <TabsTrigger value="shipping">배송중</TabsTrigger>
                <TabsTrigger value="completed">완료</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">최신순</SelectItem>
                  <SelectItem value="price">가격순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">주문 내역이 없습니다.</p>
            <Button variant="link" onClick={() => router.push("/")}>
              상품 둘러보기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <Card
                key={order.id}
                className={`overflow-hidden ${order.isMultiProduct ? "border-blue-200 bg-blue-50/30" : ""}`}
              >
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">주문번호: {order.id}</p>
                        <p className="text-sm text-muted-foreground">주문일자: {order.orderDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.isMultiProduct && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            <Package className="h-3 w-3 mr-1" />
                            다중 상품
                          </Badge>
                        )}
                        <Badge variant={getStatusBadgeVariant(order.status) as any}>{order.status}</Badge>
                      </div>
                    </div>
                  </div>

                  {order.isMultiProduct ? (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">{order.products.length}개 상품 패키지</h3>
                      </div>

                      <Accordion type="single" collapsible className="w-full mb-3">
                        <AccordionItem value="products">
                          <AccordionTrigger className="text-sm font-medium py-2">포함된 상품 목록</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 mt-1">
                              {order.products.map((product) => (
                                <div key={product.id} className="flex items-start gap-3 p-2 rounded-md bg-background">
                                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                      src={product.imageUrl || "/placeholder.svg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <h4 className="font-medium text-sm">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground">{product.description}</p>
                                    <p className="text-primary text-sm font-semibold mt-1">
                                      {product.price.toLocaleString()}원
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-primary font-semibold">총 {order.totalAmount.toLocaleString()}원</p>
                          {order.trackingNumber && (
                            <p className="text-xs text-muted-foreground mt-1">운송장번호: {order.trackingNumber}</p>
                          )}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/mypage/orders/${order.id}`)}>
                          상세보기
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={order.products[0].imageUrl || "/placeholder.svg"}
                          alt={order.products[0].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{order.products[0].name}</h3>
                        <p className="text-primary font-semibold">{order.totalAmount.toLocaleString()}원</p>
                        {order.trackingNumber && (
                          <p className="text-xs text-muted-foreground">운송장번호: {order.trackingNumber}</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/mypage/orders/${order.id}`)}>
                        상세보기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
