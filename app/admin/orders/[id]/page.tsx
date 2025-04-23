"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Truck, Package, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockOrderDetails } from "@/lib/mock-data"
import type { OrderDetail } from "@/lib/types"

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const orderId = params.id as string

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // 모킹된 데이터에서 주문 찾기
        const foundOrder = mockOrderDetails.find((o) => o.id === orderId)

        if (foundOrder) {
          setOrder(foundOrder)
          setNewStatus(foundOrder.status)
        } else {
          toast({
            title: "오류 발생",
            description: "주문 정보를 찾을 수 없습니다.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "주문 정보를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetail()
  }, [orderId, toast])

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

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order?.status) return

    setIsUpdating(true)

    try {
      // 실제 구현에서는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 주문 상태 업데이트 (모킹)
      if (order) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          history: [
            ...order.history,
            {
              date: new Date().toISOString().split("T")[0],
              status: newStatus,
              description: statusNote || `주문 상태가 ${newStatus}(으)로 변경되었습니다.`,
            },
          ],
        }

        setOrder(updatedOrder)
        setStatusNote("")

        toast({
          title: "상태 업데이트 완료",
          description: `주문 상태가 ${newStatus}(으)로 변경되었습니다.`,
        })
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "상태 업데이트 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">주문 상세</h1>
        </div>

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
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">주문 상세</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">주문을 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 주문 정보를 찾을 수 없습니다.</p>
            <Button onClick={() => router.push("/admin/orders")}>주문 목록으로 돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">주문 상세</h1>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">주문번호: {order.id}</p>
          <p className="text-sm text-muted-foreground">주문일자: {order.orderDate}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status) as any} className="text-sm py-1 px-3">
          {getStatusIcon(order.status)}
          <span className="ml-1">{order.status}</span>
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium">{order.shipping.email}</p>
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
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>상태 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">주문 상태 변경</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="관리자 승인 대기">관리자 승인 대기</SelectItem>
                    <SelectItem value="결제 대기">결제 대기</SelectItem>
                    <SelectItem value="배송 준비중">배송 준비중</SelectItem>
                    <SelectItem value="배송중">배송중</SelectItem>
                    <SelectItem value="배송 완료">배송 완료</SelectItem>
                    <SelectItem value="주문 취소">주문 취소</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">운송장 번호</label>
                <div className="flex gap-2">
                  <Input placeholder="운송장 번호 입력" defaultValue={order.trackingNumber || ""} />
                  <Button variant="outline">저장</Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">상태 변경 메모</label>
              <Textarea
                placeholder="상태 변경에 대한 메모를 입력하세요"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>

            <Button onClick={handleUpdateStatus} disabled={isUpdating || newStatus === order.status}>
              {isUpdating ? "업데이트 중..." : "상태 업데이트"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
