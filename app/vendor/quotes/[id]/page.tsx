"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageSquare, Send, Clock, CheckCircle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockOrderDetails } from "@/lib/mock-data"
import { ChatModal } from "@/components/chat/chat-modal"

export default function QuoteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quoteForm, setQuoteForm] = useState({
    price: "",
    serviceFee: "",
    shippingFee: "",
    taxFee: "",
    otherFees: "",
    estimatedDeliveryDays: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [quoteStatus, setQuoteStatus] = useState<"pending" | "submitted" | "accepted" | "rejected">("pending")

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // 모의 데이터에서 주문 찾기
        const orderData = mockOrderDetails.find((o) => o.id === orderId)

        if (orderData) {
          setOrder(orderData)

          // 초기 견적 데이터 설정
          setQuoteForm({
            price: orderData.product.originalPrice.toString(),
            serviceFee: Math.round(orderData.product.originalPrice * 0.05).toString(),
            shippingFee: "25000",
            taxFee: Math.round(orderData.product.originalPrice * 0.08).toString(),
            otherFees: "0",
            estimatedDeliveryDays: "7",
            description: "최상의 품질과 빠른 배송을 약속드립니다.",
          })

          // 랜덤으로 견적 상태 설정 (데모용)
          const randomStatus = Math.random()
          if (randomStatus < 0.4) {
            setQuoteStatus("pending")
          } else if (randomStatus < 0.7) {
            setQuoteStatus("submitted")
          } else if (randomStatus < 0.9) {
            setQuoteStatus("accepted")
          } else {
            setQuoteStatus("rejected")
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setQuoteForm((prev) => ({ ...prev, [name]: value }))
  }

  const calculateTotalPrice = () => {
    const price = Number.parseInt(quoteForm.price) || 0
    const serviceFee = Number.parseInt(quoteForm.serviceFee) || 0
    const shippingFee = Number.parseInt(quoteForm.shippingFee) || 0
    const taxFee = Number.parseInt(quoteForm.taxFee) || 0
    const otherFees = Number.parseInt(quoteForm.otherFees) || 0

    return price + serviceFee + shippingFee + taxFee + otherFees
  }

  const handleSubmitQuote = async () => {
    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setQuoteStatus("submitted")

      toast({
        title: "견적 제출 완료",
        description: "견적이 성공적으로 제출되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "견적 제출 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = () => {
    switch (quoteStatus) {
      case "pending":
        return (
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="h-5 w-5" />
            <span>견적 대기 중</span>
          </div>
        )
      case "submitted":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Send className="h-5 w-5" />
            <span>견적 제출됨</span>
          </div>
        )
      case "accepted":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>견적 수락됨</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <X className="h-5 w-5" />
            <span>견적 거절됨</span>
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">견적 상세</h1>
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
          <h1 className="text-3xl font-bold">견적 상세</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold mb-2">주문을 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 주문 정보를 찾을 수 없습니다.</p>
            <Button onClick={() => router.push("/vendor/quotes")}>견적 목록으로 돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">견적 상세</h1>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>주문 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={order.product.imageUrl || "/placeholder.svg"}
                  alt={order.product.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if the image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = "/assorted-products-display.png"
                  }}
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{order.product.title}</h3>
                <p className="text-sm text-muted-foreground">출처: {order.product.platform}</p>
                <p className="text-primary font-semibold mt-1">
                  원가: {order.product.originalPrice.toLocaleString()}원
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">주문 번호</h3>
                <p>{order.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">주문 일자</h3>
                <p>{order.orderDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">고객 정보</h3>
                <p>테스트 사용자 (test@test.com)</p>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={() => setIsChatModalOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                고객과 채팅하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>견적 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">상품 가격</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={quoteForm.price}
                  onChange={handleInputChange}
                  disabled={quoteStatus !== "pending"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceFee">서비스 수수료</Label>
                <Input
                  id="serviceFee"
                  name="serviceFee"
                  type="number"
                  value={quoteForm.serviceFee}
                  onChange={handleInputChange}
                  disabled={quoteStatus !== "pending"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingFee">배송비</Label>
                <Input
                  id="shippingFee"
                  name="shippingFee"
                  type="number"
                  value={quoteForm.shippingFee}
                  onChange={handleInputChange}
                  disabled={quoteStatus !== "pending"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxFee">관세</Label>
                <Input
                  id="taxFee"
                  name="taxFee"
                  type="number"
                  value={quoteForm.taxFee}
                  onChange={handleInputChange}
                  disabled={quoteStatus !== "pending"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherFees">기타 수수료</Label>
                <Input
                  id="otherFees"
                  name="otherFees"
                  type="number"
                  value={quoteForm.otherFees}
                  onChange={handleInputChange}
                  disabled={quoteStatus !== "pending"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDeliveryDays">예상 배송 기간 (일)</Label>
                <Input
                  id="estimatedDeliveryDays"
                  name="estimatedDeliveryDays"
                  type="number"
                  value={quoteForm.estimatedDeliveryDays}
                  onChange={handleInputChange}
                  disabled={quoteStatus !== "pending"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">견적 설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={quoteForm.description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={quoteStatus !== "pending"}
                />
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg pt-2">
                <span>총 견적 금액</span>
                <span className="text-primary">{calculateTotalPrice().toLocaleString()}원</span>
              </div>

              {quoteStatus === "pending" && (
                <Button className="w-full mt-4" onClick={handleSubmitQuote} disabled={isSubmitting}>
                  {isSubmitting ? "제출 중..." : "견적 제출하기"}
                </Button>
              )}

              {quoteStatus === "submitted" && (
                <div className="bg-muted p-4 rounded-md mt-4">
                  <p className="text-center text-sm">견적이 제출되었습니다. 고객의 응답을 기다려주세요.</p>
                </div>
              )}

              {quoteStatus === "accepted" && (
                <div className="bg-green-50 p-4 rounded-md mt-4 border border-green-200">
                  <p className="text-center text-sm text-green-700">
                    축하합니다! 고객이 견적을 수락했습니다. 주문 관리 페이지에서 확인하세요.
                  </p>
                  <div className="flex justify-center mt-2">
                    <Button variant="outline" size="sm" onClick={() => router.push("/vendor/orders")}>
                      주문 관리로 이동
                    </Button>
                  </div>
                </div>
              )}

              {quoteStatus === "rejected" && (
                <div className="bg-red-50 p-4 rounded-md mt-4 border border-red-200">
                  <p className="text-center text-sm text-red-700">
                    고객이 견적을 거절했습니다. 새로운 견적을 제출하거나 고객과 채팅으로 상담해보세요.
                  </p>
                  <div className="flex justify-center mt-2">
                    <Button variant="outline" size="sm" onClick={() => setQuoteStatus("pending")}>
                      견적 다시 작성하기
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId="customer-1"
        vendorName="테스트 사용자"
      />
    </div>
  )
}
