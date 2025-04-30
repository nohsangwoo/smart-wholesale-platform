"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockOrderDetails } from "@/lib/mock-data"
import type { OrderDetail, ProductData } from "@/lib/types"

// 여러 상품을 포함하는 주문 상세 정보 타입 확장
interface MultiProductOrderDetail extends Omit<OrderDetail, "product"> {
  products: ProductData[]
  isQuoteRequest?: boolean
  vendorQuotes?: {
    vendorId: string
    vendorName: string
    totalAmount: number
    estimatedDelivery: string
    status: string
  }[]
}

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<MultiProductOrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<string[]>([])

  const orderId = params.id as string

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // 모킹된 데이터에서 주문 찾기
        const foundOrder = mockOrderDetails.find((o) => o.id === orderId)

        if (foundOrder) {
          // 주문 ID의 첫 글자 코드에 따라 견적 요청 여부 결정 (모의 데이터용)
          const isQuoteRequest = orderId.charCodeAt(0) % 5 === 0

          // 기존 주문 데이터를 여러 상품을 포함하는 형태로 변환
          const multiProductOrder: MultiProductOrderDetail = {
            ...foundOrder,
            isQuoteRequest,
            status: isQuoteRequest ? "견적 요청" : foundOrder.status,
            products: [
              {
                id: foundOrder.product.id,
                title: foundOrder.product.title,
                platform: foundOrder.product.platform,
                originalPrice: foundOrder.product.originalPrice,
                estimatedPrice: foundOrder.product.estimatedPrice,
                imageUrl: foundOrder.product.imageUrl,
                fees: foundOrder.product.fees,
                tax: foundOrder.product.tax,
                shippingCost: foundOrder.product.shippingCost,
                originalUrl: foundOrder.product.originalUrl,
                additionalNotes: "원래 요청했던 색상이 품절이면 유사한 색상으로 대체해주세요.",
              },
            ],
          }

          // 주문 ID의 첫 글자 코드에 따라 추가 상품 생성 (모의 데이터용)
          if (orderId.charCodeAt(0) % 3 > 0) {
            multiProductOrder.products.push({
              id: `product-${Date.now()}-1`,
              title: "추가 상품 - 휴대폰 보호 케이스",
              platform: "Taobao",
              originalPrice: 15000,
              estimatedPrice: 19500,
              imageUrl: "/portable-power-bank.png",
              fees: 1500,
              tax: 1000,
              shippingCost: 2000,
              additionalNotes: "투명 케이스로 부탁드립니다.",
            })
          }

          if (orderId.charCodeAt(0) % 3 > 1) {
            multiProductOrder.products.push({
              id: `product-${Date.now()}-2`,
              title: "추가 상품 - 무선 충전기",
              platform: "Alibaba",
              originalPrice: 25000,
              estimatedPrice: 32500,
              imageUrl: "/wireless-charger.png",
              fees: 2500,
              tax: 2000,
              shippingCost: 3000,
            })
          }

          // 견적 요청인 경우 판매자 견적 정보 추가
          if (isQuoteRequest) {
            multiProductOrder.vendorQuotes = [
              {
                vendorId: "vendor-1",
                vendorName: "키키퍼 로지스틱스",
                totalAmount: 120000,
                estimatedDelivery: "3-5일",
                status: "견적 제출",
              },
              {
                vendorId: "vendor-2",
                vendorName: "글로벌 트레이딩",
                totalAmount: 135000,
                estimatedDelivery: "2-4일",
                status: "견적 제출",
              },
              {
                vendorId: "vendor-3",
                vendorName: "스마트 임포트",
                totalAmount: 118000,
                estimatedDelivery: "4-7일",
                status: "검토 중",
              },
            ]
          }

          setOrder(multiProductOrder)
          setNewStatus(multiProductOrder.status)

          // 기본적으로 첫 번째 상품은 펼쳐서 보여줌
          if (multiProductOrder.products.length > 0) {
            setExpandedProducts([multiProductOrder.products[0].id])
          }
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
      case "견적 요청":
        return <FileText className="h-5 w-5" />
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
      case "견적 요청":
        return "secondary"
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

  const toggleProductExpand = (productId: string) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const calculateTotalAmount = () => {
    if (!order || !order.products) return 0
    return order.products.reduce((sum, product) => sum + product.estimatedPrice, 0)
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

      {order.isQuoteRequest && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <FileText className="h-5 w-5 mr-2" />
              견적 요청 정보
            </CardTitle>
            <CardDescription>
              이 주문은 여러 상품에 대한 견적 요청입니다. 총 {order.products.length}개의 상품에 대한 견적이
              요청되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">판매자 견적 현황</h3>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>판매자</TableHead>
                        <TableHead>견적 금액</TableHead>
                        <TableHead>예상 배송일</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.vendorQuotes?.map((quote) => (
                        <TableRow key={quote.vendorId}>
                          <TableCell className="font-medium">{quote.vendorName}</TableCell>
                          <TableCell>{quote.totalAmount.toLocaleString()}원</TableCell>
                          <TableCell>{quote.estimatedDelivery}</TableCell>
                          <TableCell>
                            <Badge variant={quote.status === "견적 제출" ? "success" : "secondary"}>
                              {quote.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>상품 정보 ({order.products.length}개)</CardTitle>
          <div className="text-lg font-semibold">
            {order.isQuoteRequest ? "견적 요청 중" : `총 결제 금액: ${calculateTotalAmount().toLocaleString()}원`}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {order.products.map((product, index) => (
              <div key={product.id} className="border rounded-md overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer bg-muted/30"
                  onClick={() => toggleProductExpand(product.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">출처: {product.platform}</p>
                      <p className="text-primary font-semibold mt-1">
                        {order.isQuoteRequest ? "견적 요청 중" : `${product.estimatedPrice.toLocaleString()}원`}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    {expandedProducts.includes(product.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedProducts.includes(product.id) && (
                  <div className="p-4 border-t">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>상품 가격</span>
                          <span>{product.originalPrice.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>수수료</span>
                          <span>{product.fees.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>관세</span>
                          <span>{product.tax.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>배송비</span>
                          <span>{product.shippingCost.toLocaleString()}원</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>상품 총액</span>
                          <span>
                            {order.isQuoteRequest ? "견적 요청 중" : `${product.estimatedPrice.toLocaleString()}원`}
                          </span>
                        </div>
                      </div>

                      {product.additionalNotes && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">구매자 추가 요청사항</h4>
                          <div className="p-3 bg-muted rounded-md text-sm">{product.additionalNotes}</div>
                        </div>
                      )}

                      {product.originalUrl && (
                        <div className="mt-2">
                          <a
                            href={product.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            원본 상품 링크 보기
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
                    <SelectItem value="견적 요청">견적 요청</SelectItem>
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
