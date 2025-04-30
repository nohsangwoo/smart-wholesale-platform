"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { VendorSidebar } from "@/components/vendor/sidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Crown, Check, AlertCircle, CreditCard, Building2, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function VendorPremiumPage() {
  const { user, isAuthenticated, isLoading } = useVendorAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentPeriod, setPaymentPeriod] = useState("monthly")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isAuthenticated && !isLoading) {
    router.push("/vendor/login")
    return null
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // 실제 구현에서는 결제 API 연동
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "프리미엄 결제가 완료되었습니다",
        description: "판매자 프리미엄 서비스가 활성화되었습니다.",
      })
    }, 1500)
  }

  const premiumFeatures = [
    {
      title: "견적 우선 노출",
      description: "구매자의 견적 목록에서 일반 판매자보다 상위에 노출됩니다.",
      icon: <Crown className="h-5 w-5 text-amber-500" />,
    },
    {
      title: "프리미엄 배지",
      description: "프로필과 견적에 프리미엄 판매자 배지가 표시됩니다.",
      icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
      title: "상세 분석 리포트",
      description: "견적 성공률, 고객 반응 등 상세한 분석 리포트를 제공합니다.",
      icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
    },
  ]

  const pricingOptions = {
    monthly: {
      price: "49,000",
      period: "월",
      discount: "",
    },
    yearly: {
      price: "490,000",
      period: "년",
      discount: "2개월 무료",
    },
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Crown className="h-6 w-6 text-amber-500" /> 판매자 프리미엄 서비스
            </h1>
            <p className="text-muted-foreground mt-1">
              프리미엄 서비스로 더 많은 구매자에게 노출되고 비즈니스를 성장시키세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>프리미엄 서비스 혜택</CardTitle>
                <CardDescription>프리미엄 서비스에 가입하면 다음과 같은 혜택을 누릴 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="bg-gray-100 p-2 rounded-full">{feature.icon}</div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>프리미엄 요금제</CardTitle>
                  <Crown className="h-6 w-6 text-amber-500" />
                </div>
                <CardDescription>원하는 결제 주기를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="monthly" value={paymentPeriod} onValueChange={setPaymentPeriod} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="monthly">월간 결제</TabsTrigger>
                    <TabsTrigger value="yearly">연간 결제</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly" className="space-y-4">
                    <div className="text-center p-4 rounded-lg bg-white border">
                      <div className="text-3xl font-bold">₩{pricingOptions.monthly.price}</div>
                      <div className="text-sm text-muted-foreground">/{pricingOptions.monthly.period}</div>
                    </div>
                  </TabsContent>
                  <TabsContent value="yearly" className="space-y-4">
                    <div className="text-center p-4 rounded-lg bg-white border relative">
                      <div className="absolute -top-2 right-0 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        {pricingOptions.yearly.discount}
                      </div>
                      <div className="text-3xl font-bold">₩{pricingOptions.yearly.price}</div>
                      <div className="text-sm text-muted-foreground">/{pricingOptions.yearly.period}</div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? "처리 중..." : "프리미엄 가입하기"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>결제 방법 선택</CardTitle>
              <CardDescription>원하시는 결제 방법을 선택해주세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue="card"
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    신용카드 / 체크카드
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    무통장 입금
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">카드 번호</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiryDate">만료일</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cardHolder">카드 소유자 이름</Label>
                    <Input id="cardHolder" placeholder="홍길동" />
                  </div>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">무통장 입금 안내</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      아래 계좌로 입금 후 입금자명과 입금액을 입력해주세요. 확인 후 서비스가 활성화됩니다.
                    </p>
                    <div className="mt-2 p-2 bg-white rounded border border-blue-200">
                      <p className="text-sm">
                        <span className="font-medium">입금 계좌:</span> 신한은행 110-123-456789
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">예금주:</span> (주)스마트도소매
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">입금액:</span> ₩
                        {paymentPeriod === "monthly" ? pricingOptions.monthly.price : pricingOptions.yearly.price}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="depositorName">입금자명</Label>
                    <Input id="depositorName" placeholder="입금자명을 입력하세요" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="depositAmount">입금액</Label>
                    <Input
                      id="depositAmount"
                      placeholder="입금액을 입력하세요"
                      defaultValue={
                        paymentPeriod === "monthly" ? pricingOptions.monthly.price : pricingOptions.yearly.price
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="depositNote">참고사항 (선택)</Label>
                    <Textarea id="depositNote" placeholder="참고사항이 있으면 입력해주세요" />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
                  "처리 중..."
                ) : (
                  <span className="flex items-center gap-2">
                    결제하기 <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
