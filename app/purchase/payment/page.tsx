"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronRight, CreditCard, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { mockOrderDetails } from "@/lib/mock-data"
import { mockVendors } from "@/lib/mock-vendors"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const orderId = searchParams.get("orderId")
  const quoteId = searchParams.get("quoteId")

  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  const [order, setOrder] = useState<any>(null)
  const [vendor, setVendor] = useState<any>(null)
  const [quote, setQuote] = useState<any>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId || !quoteId) {
      toast({
        title: "오류",
        description: "주문 정보를 찾을 수 없습니다.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    const fetchData = async () => {
      try {
        // 주문 정보 가져오기 (모킹)
        const orderData = mockOrderDetails.find((o) => o.id === orderId)
        if (!orderData) {
          // 주문을 찾을 수 없을 때 폴백 사용
          const fallbackOrder = mockOrderDetails[0]
          if (fallbackOrder) {
            setOrder(fallbackOrder)
            console.log("Using fallback order:", fallbackOrder.id)
          } else {
            throw new Error("주문을 찾을 수 없습니다.")
          }
        } else {
          setOrder(orderData)
        }

        // 업체 정보 가져오기 (모킹)
        const vendorData = mockVendors.find((v) => v.id === quoteId)
        if (!vendorData) {
          // 업체를 찾을 수 없을 때 폴백 사용
          const fallbackVendor = mockVendors[0]
          if (fallbackVendor) {
            setVendor(fallbackVendor)
            console.log("Using fallback vendor:", fallbackVendor.id)
          } else {
            throw new Error("업체를 찾을 수 없습니다.")
          }
        } else {
          setVendor(vendorData)
        }

        // 견적 정보 생성 (모킹)
        const orderToUse = orderData || mockOrderDetails[0]
        const vendorToUse = vendorData || mockVendors[0]

        const quoteData = {
          vendorId: vendorToUse.id,
          orderId: orderToUse.id,
          price: orderToUse.product.originalPrice,
          estimatedDeliveryDays: 7 + Math.floor(Math.random() * 8),
          description: "최상의 품질과 빠른 배송을 약속드립니다.",
          additionalFees: {
            serviceFee: Math.round(orderToUse.product.originalPrice * 0.05),
            shippingFee: 25000,
            taxFee: Math.round(orderToUse.product.originalPrice * 0.08),
            otherFees: vendorToUse.premium ? 10000 : 0,
          },
          createdAt: new Date().toISOString(),
        }
        setQuote(quoteData)

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoadError(error instanceof Error ? error.message : "데이터를 불러오는 중 문제가 발생했습니다.")
        toast({
          title: "오류 발생",
          description: "데이터를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
        // 오류 발생 시에도 로딩 상태 해제
        setIsLoading(false)
      }
    }

    fetchData()
  }, [orderId, quoteId, router, toast])

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // 결제 처리 시뮬레이션
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentComplete(true)

      // 결제 완료 후 3초 후 마이페이지로 이동
      setTimeout(() => {
        router.push("/mypage/orders")
      }, 3000)
    }, 2000)
  }

  const calculateTotalPrice = () => {
    if (!quote) return 0
    return (
      quote.price +
      quote.additionalFees.serviceFee +
      quote.additionalFees.shippingFee +
      quote.additionalFees.taxFee +
      (quote.additionalFees.otherFees || 0)
    )
  }

  if (paymentComplete) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">결제 완료!</h1>
          <p className="mb-8">구매 대행 결제가 성공적으로 완료되었습니다. 곧 마이페이지로 이동합니다.</p>
          <Button onClick={() => router.push("/mypage/orders")}>주문 내역 확인하기</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
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

  if (loadError) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h1>
          <p className="mb-6">{loadError}</p>
          <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
        </div>
      </div>
    )
  }

  // 데이터가 없는 경우 처리
  if (!order || !vendor || !quote) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-amber-600 mb-4">데이터 로드 실패</h1>
          <p className="mb-6">주문 또는 견적 정보를 불러올 수 없습니다.</p>
          <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.push("/")} className="text-sm text-muted-foreground hover:text-foreground">
            홈
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">결제</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">결제 정보 입력</h1>

        <form onSubmit={handlePayment}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>선택한 견적 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={vendor.profileImage || "/placeholder.svg?height=64&width=64&query=vendor"}
                    alt={vendor.name || "업체 이미지"}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if the image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = "/market-stall-produce.png"
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{vendor.name}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-amber-500">★</span>
                    <span className="ml-1">{vendor.rating}</span>
                    <span className="text-muted-foreground ml-1">({vendor.reviewCount})</span>
                  </div>
                  <p className="text-sm text-muted-foreground">예상 배송: {quote.estimatedDeliveryDays}일 이내</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>상품 가격</span>
                  <span>{quote.price.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>서비스 수수료</span>
                  <span>{quote.additionalFees.serviceFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>배송비</span>
                  <span>{quote.additionalFees.shippingFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>관세</span>
                  <span>{quote.additionalFees.taxFee.toLocaleString()}원</span>
                </div>
                {quote.additionalFees.otherFees > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>기타 수수료</span>
                    <span>{quote.additionalFees.otherFees.toLocaleString()}원</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>총 결제 금액</span>
                  <span className="text-primary">{calculateTotalPrice().toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>결제 수단 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    신용/체크카드
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">계좌이체</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="virtual" id="virtual" />
                  <Label htmlFor="virtual">가상계좌</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {paymentMethod === "card" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>카드 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">카드 번호</Label>
                  <Input id="cardNumber" placeholder="0000-0000-0000-0000" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">유효기간</Label>
                    <Input id="expiryDate" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">보안코드 (CVV)</Label>
                    <Input id="cvv" placeholder="000" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">카드 소유자 이름</Label>
                  <Input id="cardHolder" placeholder="카드에 표시된 이름" required />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isProcessing}>
              {isProcessing ? "처리 중..." : `${calculateTotalPrice().toLocaleString()}원 결제하기`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
