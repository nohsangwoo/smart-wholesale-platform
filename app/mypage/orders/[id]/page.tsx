"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import {
  ChevronRight,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// 다중 상품 주문 상세 데이터
const multiProductOrderDetails = [
  {
    id: "order-6",
    status: "배송 완료",
    orderDate: "2024-03-01",
    estimatedDeliveryDate: "2024-03-15",
    trackingNumber: "KR456789123",
    totalAmount: 9500000,
    isMultiProduct: true,
    products: [
      {
        id: "prod-007",
        title: "무선 충전기 (300개)",
        platform: "Alibaba",
        originalPrice: 3500000,
        estimatedPrice: 4200000,
        imageUrl: "/wireless-charger.png",
        fees: 175000,
        tax: 280000,
        shippingCost: 245000,
        originalUrl: "https://alibaba.com/product/wireless-charger",
        description: "고속 무선 충전기, 다양한 스마트폰 호환",
      },
      {
        id: "prod-008",
        title: "보조 배터리 (200개)",
        platform: "Taobao",
        originalPrice: 3200000,
        estimatedPrice: 3800000,
        imageUrl: "/portable-power-bank.png",
        fees: 160000,
        tax: 256000,
        shippingCost: 184000,
        originalUrl: "https://taobao.com/product/power-bank",
        description: "10,000mAh 이상 고용량 보조 배터리",
      },
      {
        id: "prod-009",
        title: "스마트워치 밴드 (500개)",
        platform: "1688",
        originalPrice: 1200000,
        estimatedPrice: 1500000,
        imageUrl: "/smartwatch-band-variety.png",
        fees: 60000,
        tax: 96000,
        shippingCost: 144000,
        originalUrl: "https://1688.com/product/smartwatch-band",
        description: "다양한 색상의 실리콘 스마트워치 밴드",
      },
    ],
    shipping: {
      name: "테스트 사용자",
      phone: "010-1234-5678",
      email: "test@test.com",
      address: "서울특별시 강남구",
      detailAddress: "테헤란로 123",
      zipCode: "06123",
      requestNote: "부재시 경비실에 맡겨주세요.",
    },
    paymentMethod: "신용카드",
    history: [
      {
        date: "2024-03-01",
        status: "주문 접수",
        description: "주문이 접수되었습니다.",
      },
      {
        date: "2024-03-02",
        status: "관리자 승인",
        description: "주문이 승인되었습니다.",
      },
      {
        date: "2024-03-02",
        status: "결제 완료",
        description: "결제가 완료되었습니다.",
      },
      {
        date: "2024-03-05",
        status: "상품 준비중",
        description: "상품을 준비 중입니다.",
      },
      {
        date: "2024-03-10",
        status: "배송 시작",
        description: "상품이 배송지로 출발했습니다.",
      },
      {
        date: "2024-03-15",
        status: "배송 완료",
        description: "상품이 배송지에 도착했습니다.",
      },
    ],
  },
  {
    id: "order-7",
    status: "배송중",
    orderDate: "2024-03-10",
    estimatedDeliveryDate: "2024-03-25",
    trackingNumber: "KR789123456",
    totalAmount: 7500000,
    isMultiProduct: true,
    products: [
      {
        id: "prod-010",
        title: "블루투스 스피커 (100개)",
        platform: "Alibaba",
        originalPrice: 2800000,
        estimatedPrice: 3500000,
        imageUrl: "/bluetooth-speaker.png",
        fees: 140000,
        tax: 224000,
        shippingCost: 336000,
        originalUrl: "https://alibaba.com/product/bluetooth-speaker",
        description: "회의실용 고품질 블루투스 스피커",
      },
      {
        id: "prod-011",
        title: "사무용 모니터 (50개)",
        platform: "1688",
        originalPrice: 3200000,
        estimatedPrice: 4000000,
        imageUrl: "/office-monitor.png",
        fees: 160000,
        tax: 256000,
        shippingCost: 384000,
        originalUrl: "https://1688.com/product/office-monitor",
        description: "27인치 Full HD 모니터",
      },
    ],
    shipping: {
      name: "테스트 사용자",
      phone: "010-1234-5678",
      email: "test@test.com",
      address: "서울특별시 강남구",
      detailAddress: "테헤란로 123",
      zipCode: "06123",
    },
    paymentMethod: "계좌이체",
    history: [
      {
        date: "2024-03-10",
        status: "주문 접수",
        description: "주문이 접수되었습니다.",
      },
      {
        date: "2024-03-11",
        status: "관리자 승인",
        description: "주문이 승인되었습니다.",
      },
      {
        date: "2024-03-11",
        status: "결제 완료",
        description: "결제가 완료되었습니다.",
      },
      {
        date: "2024-03-15",
        status: "상품 준비중",
        description: "상품을 준비 중입니다.",
      },
      {
        date: "2024-03-20",
        status: "배송 시작",
        description: "상품이 배송지로 출발했습니다.",
      },
    ],
  },
]

// 기존 단일 상품 주문 데이터 (예시)
const singleProductOrderDetails = [
  {
    id: "order-1",
    status: "배송 완료",
    orderDate: "2024-02-15",
    estimatedDeliveryDate: "2024-02-25",
    trackingNumber: "KR123456789",
    totalAmount: 1200000,
    product: {
      id: "prod-001",
      title: "스마트폰 케이스 (100개)",
      platform: "Alibaba",
      originalPrice: 800000,
      estimatedPrice: 1000000,
      imageUrl: "/bulk-smartphone-cases.png",
      fees: 40000,
      tax: 64000,
      shippingCost: 96000,
      originalUrl: "https://alibaba.com/product/smartphone-cases",
    },
    shipping: {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      address: "서울특별시 강남구",
      detailAddress: "테헤란로 123",
      zipCode: "06123",
    },
    paymentMethod: "신용카드",
    history: [
      {
        date: "2024-02-15",
        status: "주문 접수",
        description: "주문이 접수되었습니다.",
      },
      {
        date: "2024-02-16",
        status: "관리자 승인",
        description: "주문이 승인되었습니다.",
      },
      {
        date: "2024-02-16",
        status: "결제 완료",
        description: "결제가 완료되었습니다.",
      },
      {
        date: "2024-02-18",
        status: "상품 준비중",
        description: "상품을 준비 중입니다.",
      },
      {
        date: "2024-02-20",
        status: "배송 시작",
        description: "상품이 배송지로 출발했습니다.",
      },
      {
        date: "2024-02-25",
        status: "배송 완료",
        description: "상품이 배송지에 도착했습니다.",
      },
    ],
  },
  {
    id: "order-2",
    status: "배송중",
    orderDate: "2024-02-20",
    estimatedDeliveryDate: "2024-03-01",
    trackingNumber: "KR987654321",
    totalAmount: 2500000,
    product: {
      id: "prod-002",
      title: "블루투스 이어폰 (50개)",
      platform: "1688",
      originalPrice: 2000000,
      estimatedPrice: 2300000,
      imageUrl: "/bulk-bluetooth-earphones.png",
      fees: 100000,
      tax: 160000,
      shippingCost: 240000,
      originalUrl: "https://1688.com/product/bluetooth-earphones",
    },
    shipping: {
      name: "김철수",
      phone: "010-9876-5432",
      email: "kim@example.com",
      address: "서울특별시 서초구",
      detailAddress: "서초대로 123",
      zipCode: "06456",
    },
    paymentMethod: "계좌이체",
    history: [
      {
        date: "2024-02-20",
        status: "주문 접수",
        description: "주문이 접수되었습니다.",
      },
      {
        date: "2024-02-21",
        status: "관리자 승인",
        description: "주문이 승인되었습니다.",
      },
      {
        date: "2024-02-21",
        status: "결제 완료",
        description: "결제가 완료되었습니다.",
      },
      {
        date: "2024-02-23",
        status: "상품 준비중",
        description: "상품을 준비 중입니다.",
      },
      {
        date: "2024-02-25",
        status: "배송 시작",
        description: "상품이 배송지로 출발했습니다.",
      },
    ],
  },
]

// 모든 주문 데이터 병합
const allOrderDetails = [...singleProductOrderDetails, ...multiProductOrderDetails]

export default function OrderDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [orderDetail, setOrderDetail] = useState<any>(null)
  const [isOrderLoading, setIsOrderLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    const orderId = params.id as string

    // 모의 데이터에서 주문 상세 정보 가져오기
    const fetchOrderDetail = async () => {
      try {
        // 모든 주문 데이터에서 해당 ID의 주문 찾기
        const order = allOrderDetails.find((order) => order.id === orderId)

        if (order) {
          console.log("Found order:", order) // 디버깅용
          setOrderDetail(order)
        } else {
          toast({
            title: "오류 발생",
            description: "주문 정보를 찾을 수 없습니다.",
            variant: "destructive",
          })
          router.push("/mypage/orders")
        }
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "주문 상세 정보를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsOrderLoading(false)
      }
    }

    fetchOrderDetail()
  }, [isAuthenticated, isLoading, params.id, router, toast])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "주문 접수":
      case "관리자 승인":
      case "결제 완료":
      case "상품 준비중":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "배송 시작":
      case "배송중":
        return <Truck className="h-5 w-5 text-indigo-500" />
      case "배송 완료":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "주문 취소 요청":
      case "주문 취소":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getProgressValue = () => {
    const status = orderDetail.status
    switch (status) {
      case "관리자 승인 대기":
        return 10
      case "결제 대기":
        return 20
      case "배송 준비중":
        return 40
      case "배송중":
        return 70
      case "배송 완료":
        return 100
      case "주문 취소":
        return 100
      default:
        return 0
    }
  }

  if (isLoading || isOrderLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetail) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">주문 정보를 찾을 수 없습니다</h1>
          <Button onClick={() => router.push("/mypage/orders")}>주문 목록으로 돌아가기</Button>
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
          <button
            onClick={() => router.push("/mypage/orders")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            주문 내역
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">주문 상세</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">주문 상세 정보</h1>
          <Badge
            variant={
              orderDetail.status === "배송 완료"
                ? "success"
                : orderDetail.status === "배송중" || orderDetail.status === "배송 준비중"
                  ? "secondary"
                  : orderDetail.status === "주문 취소"
                    ? "destructive"
                    : "outline"
            }
            className="text-sm py-1"
          >
            {orderDetail.status}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>주문 정보</CardTitle>
                <CardDescription>
                  주문번호: {orderDetail.id} | 주문일자: {orderDetail.orderDate}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {orderDetail.isMultiProduct && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    <Package className="h-3 w-3 mr-1" />
                    다중 상품
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">주문 진행 상태</h3>
                <Progress value={getProgressValue()} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>주문 접수</span>
                  <span>결제 완료</span>
                  <span>상품 준비</span>
                  <span>배송중</span>
                  <span>배송 완료</span>
                </div>
              </div>

              {orderDetail.isMultiProduct ? (
                <div>
                  <div className="flex items-center gap-2 mb-3 mt-6">
                    <Layers className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">다중 상품 주문 ({orderDetail.products.length}개 상품)</h3>
                  </div>

                  <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium text-blue-700">이 주문은 여러 상품을 포함하고 있습니다</p>
                    </div>
                    <p className="text-xs text-blue-600">아래에서 각 상품의 상세 정보를 확인할 수 있습니다.</p>
                  </div>

                  <Accordion type="single" collapsible className="w-full mb-3" defaultValue="products">
                    <AccordionItem value="products">
                      <AccordionTrigger className="text-sm font-medium py-2">포함된 상품 목록</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 mt-1">
                          {orderDetail.products.map((product: any, index: number) => (
                            <div
                              key={product.id}
                              className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-muted"
                            >
                              <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.imageUrl || "/placeholder.svg"}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{product.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    상품 #{index + 1}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{product.description}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                                  <span className="text-primary font-medium">
                                    {product.estimatedPrice.toLocaleString()}원
                                  </span>
                                  <span className="text-muted-foreground">플랫폼: {product.platform}</span>
                                  {product.originalUrl && (
                                    <a
                                      href={product.originalUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline text-xs flex items-center"
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      원본 링크
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="space-y-4 mt-4">
                    <h3 className="text-sm font-medium">가격 정보</h3>
                    <div className="space-y-2 p-3 rounded-md bg-muted/30">
                      {orderDetail.products.map((product: any, index: number) => (
                        <div
                          key={`price-${product.id}`}
                          className="pb-2 mb-2 border-b border-border last:border-0 last:mb-0 last:pb-0"
                        >
                          <p className="text-sm font-medium mb-1">
                            상품 #{index + 1}: {product.title.split("(")[0]}
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">상품 가격</span>
                              <span>{product.originalPrice.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">수수료</span>
                              <span>{product.fees.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">세금</span>
                              <span>{product.tax.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">배송비</span>
                              <span>{product.shippingCost.toLocaleString()}원</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>총 결제 금액</span>
                        <span className="text-primary text-lg">{orderDetail.totalAmount.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // 기존 단일 상품 주문 표시 코드
                <div>
                  <h3 className="text-sm font-medium mb-2">상품 정보</h3>
                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/30">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={orderDetail.product.imageUrl || "/placeholder.svg"}
                        alt={orderDetail.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{orderDetail.product.title}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                        <span className="text-primary font-medium">
                          {orderDetail.product.estimatedPrice?.toLocaleString() ||
                            orderDetail.product.originalPrice?.toLocaleString()}
                          원
                        </span>
                        <span className="text-muted-foreground">플랫폼: {orderDetail.product.platform}</span>
                        {orderDetail.product.originalUrl && (
                          <a
                            href={orderDetail.product.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            원본 링크
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">가격 정보</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">상품 가격</span>
                          <span>{orderDetail.product.originalPrice.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">수수료</span>
                          <span>{orderDetail.product.fees.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">세금</span>
                          <span>{orderDetail.product.tax.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">배송비</span>
                          <span>{orderDetail.product.shippingCost.toLocaleString()}원</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>총 결제 금액</span>
                          <span className="text-primary">{orderDetail.totalAmount.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">결제 정보</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">결제 방법</span>
                          <span>{orderDetail.paymentMethod || "미결제"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">결제 상태</span>
                          <span>{orderDetail.status === "결제 대기" ? "미결제" : "결제 완료"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-2">배송 정보</h3>
                <div className="space-y-1 text-sm p-3 rounded-md bg-muted/30">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">수령인</span>
                    <span>{orderDetail.shipping.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">연락처</span>
                    <span>{orderDetail.shipping.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">이메일</span>
                    <span>{orderDetail.shipping.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">주소</span>
                    <span className="text-right">
                      ({orderDetail.shipping.zipCode}) {orderDetail.shipping.address}{" "}
                      {orderDetail.shipping.detailAddress}
                    </span>
                  </div>
                  {orderDetail.shipping.requestNote && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">배송 요청사항</span>
                      <span>{orderDetail.shipping.requestNote}</span>
                    </div>
                  )}
                </div>
              </div>

              {orderDetail.trackingNumber && (
                <div>
                  <h3 className="text-sm font-medium mb-2">배송 추적</h3>
                  <div className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm">운송장 번호: {orderDetail.trackingNumber}</p>
                        {orderDetail.estimatedDeliveryDate && (
                          <p className="text-xs text-muted-foreground">
                            예상 배송 완료일: {orderDetail.estimatedDeliveryDate}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://tracker.delivery/`, "_blank")}
                    >
                      배송 조회
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">주문 처리 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>
              <div className="space-y-6 relative">
                {orderDetail.history.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-background"></div>
                    <div className="w-6 h-6 rounded-full bg-background border border-input flex items-center justify-center flex-shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-grow pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{item.status}</h3>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {orderDetail.status === "배송 완료" && (
              <Button variant="outline" onClick={() => router.push("/inquiry")}>
                문의하기
              </Button>
            )}
            <Button onClick={() => router.push("/mypage/orders")}>목록으로 돌아가기</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
