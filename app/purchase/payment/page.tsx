"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronRight, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>결제 금액</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>총 결제 금액</span>
                  <span className="font-bold text-primary">585,000원</span>
                </div>
                <p className="text-sm text-muted-foreground">* 결제 완료 후 구매 대행이 진행됩니다.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isProcessing}>
              {isProcessing ? "처리 중..." : "결제하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
