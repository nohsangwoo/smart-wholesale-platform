"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function WaitingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const orderId = searchParams.get("orderId")

  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [quotesReady, setQuotesReady] = useState(false)

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "오류",
        description: "주문 정보를 찾을 수 없습니다.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    // 진행 상태 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setQuotesReady(true)
          return 100
        }
        return prev + 5
      })
    }, 300)

    // 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [orderId, router, toast])

  const handleViewQuotes = () => {
    // 디버깅을 위한 로그 추가
    console.log("Navigating to quotes page with orderId:", orderId)

    if (!orderId) {
      toast({
        title: "오류",
        description: "주문 ID가 없습니다. 홈으로 이동합니다.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    // 유효한 주문 ID인지 확인 (모킹 데이터에 존재하는지)
    const validOrderIds = ["order-1", "order-2", "order-3", "order-4", "order-5", "order-6", "order-7", "order-8"]

    // 만약 orderId가 유효하지 않다면, 유효한 ID 중 하나를 사용
    let targetOrderId = orderId
    if (!validOrderIds.includes(orderId)) {
      console.log("Invalid orderId, using a valid one instead:", orderId)
      targetOrderId = "order-1" // 기본값으로 유효한 ID 사용

      toast({
        title: "주문 ID 변경",
        description: "유효한 주문 ID로 변경되었습니다.",
      })
    }

    router.push(`/purchase/quotes?orderId=${targetOrderId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">주문 정보를 확인 중입니다...</h2>
          <p className="text-muted-foreground">잠시만 기다려주세요.</p>
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
          <span className="text-sm">견적 대기</span>
        </div>

        <div className="text-center py-8">
          {quotesReady ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">견적 준비 완료!</h1>
              <p className="mb-6">전문가들이 제안한 견적이 준비되었습니다.</p>
              <Button onClick={handleViewQuotes}>견적 확인하기</Button>
            </>
          ) : (
            <>
              <div className="relative h-24 w-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
                  <span className="text-xl font-bold">{progress}%</span>
                </div>
                <svg className="absolute inset-0 transform -rotate-90" width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    className="text-muted"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="4"
                    strokeDasharray={287.5}
                    strokeDashoffset={287.5 - (progress / 100) * 287.5}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">조금만 기다려 주세요</h1>
              <p className="mb-6 text-muted-foreground">
                전문가들이 귀하의 구매 대행 요청에 대한 견적을 준비 중입니다.
              </p>
              <Progress value={progress} className="w-full max-w-md mx-auto mb-6" />
            </>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>주문 번호</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>주문 상태</span>
                <span className="font-medium text-amber-600">견적 대기 중</span>
              </div>
              <div className="flex justify-between">
                <span>주문 일시</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted p-4 rounded-lg mb-8">
          <h3 className="font-medium mb-2">다음 단계는 무엇인가요?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>전문가들이 귀하의 요청에 맞는 견적을 제안합니다.</li>
            <li>제안된 견적들을 비교하고 가장 적합한 견적을 선택하세요.</li>
            <li>선택한 견적으로 결제를 진행합니다.</li>
            <li>전문가가 구매 대행을 진행합니다.</li>
            <li>상품 도착 시 알림을 받게 됩니다.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
