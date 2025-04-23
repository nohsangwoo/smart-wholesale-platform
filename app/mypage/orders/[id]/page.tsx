"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Truck, Package, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { OrderDetail } from "@/lib/types"

export default function OrderDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isOrderLoading, setIsOrderLoading] = useState(true)

  const orderId = params.id as string

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()

        if (response.ok) {
          setOrder(data.order)
        } else {
          throw new Error(data.message || "주문 정보를 불러오는 중 오류가 발생했습니다.")
        }
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "주문 정보를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsOrderLoading(false)
      }
    }

    fetchOrderDetail()
  }, [orderId, isAuthenticated, isLoading, router, toast])

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
      case "주문 취소":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "배송 준비중":
        return <Package className="h-5 w-5" />
      case "배송중":
        return <Truck className="h-5 w-5" />
      case "배송 완료":
        return <CheckCircle className="h-5 w-5" />
      case "관리자 승인 대기":
        return <Clock className="h-5 w-5" />
      case "결제 대기":
        return <Clock className="h-5 w-5" />
      case "주문 취소":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const handleInquiryClick = () => {
    router.push(`/inquiry?orderId=${orderId}&type=order`)
  }

  if (isLoading || isOrderLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">주문을 찾을 수 없습니다</h2>
          <p className="mb-6">요청하신 주문 정보를 찾을 수 없습니다.</p>
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
            onClick={() => router.push("/mypage/orders")}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            주문 목록으로 돌아가기
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">주문 상세 정보</h1>
          <Badge variant={getStatusBadgeVariant(order.status) as any} className="text-sm py-1 px-3">
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status}</span>
          </Badge>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>주문 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">주문 번호</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">주문 일자</p>
                    <p className="font-medium">{order.orderDate}</p>
                  </div>
                </div>
                {order.estimatedDeliveryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">예상 배송 완료일</p>
                    <p className="font-medium">{order.estimatedDeliveryDate}</p>
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">운송장 번호</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.trackingNumber}</p>
                      <Button variant="link" className="h-auto p-0 text-primary" size="sm">
                        배송 조회
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>상품 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={order.product.imageUrl || "/placeholder.svg"}
                    alt={order.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{order.product.title}</h3>
                  <p className="text-sm text-muted-foreground">출처: {order.product.platform}</p>
                  <p className="text-primary font-semibold mt-1">{order.totalAmount.toLocaleString()}원</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>상품 가격</span>
                  <span>{order.product.originalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>수수료</span>
                  <span>{order.product.fees.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>관세</span>
                  <span>{order.product.tax.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>배송비</span>
                  <span>{order.product.shippingCost.toLocaleString()}원</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>총 결제 금액</span>
                  <span>{order.totalAmount.toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>배송지 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">수령인</p>
                    <p className="font-medium">{order.shipping.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">연락처</p>
                    <p className="font-medium">{order.shipping.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">주소</p>
                  <p className="font-medium">
                    ({order.shipping.zipCode}) {order.shipping.address} {order.shipping.detailAddress}
                  </p>
                </div>
                {order.shipping.requestNote && (
                  <div>
                    <p className="text-sm text-muted-foreground">요청사항</p>
                    <p>{order.shipping.requestNote}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>주문 처리 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.history.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 text-sm text-muted-foreground">{item.date}</div>
                    <div>
                      <p className="font-medium">{item.status}</p>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            {order.status !== "배송 완료" && order.status !== "주문 취소" && (
              <Button variant="outline">주문 취소 요청</Button>
            )}
            <Button onClick={handleInquiryClick}>문의하기</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
