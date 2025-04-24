"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const orderId = searchParams.get("orderId")

  const [isLoading, setIsLoading] = useState(true)
  const [adminApproved, setAdminApproved] = useState(false)
  const [countdown, setCountdown] = useState(5)

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

    // 관리자 승인 프로세스 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [orderId, router, toast])

  useEffect(() => {
    if (adminApproved) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            router.push("/purchase/payment")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [adminApproved, router])

  const handleAdminApproval = () => {
    console.log("Admin approval for orderId:", orderId)
    setAdminApproved(true)
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
          <span className="text-sm">주문 확인</span>
        </div>

        {adminApproved ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">관리자 승인 완료!</h1>
            <p className="mb-6">구매 대행 요청이 승인되었습니다. {countdown}초 후 결제 페이지로 이동합니다.</p>
            <Button onClick={() => router.push("/purchase/payment")}>바로 결제 페이지로 이동</Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">주문 접수 완료!</h1>
              <p className="text-muted-foreground">
                구매 대행 요청이 성공적으로 접수되었습니다. 관리자 승인 후 결제가 진행됩니다.
              </p>
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
                    <span className="font-medium text-amber-600">관리자 승인 대기</span>
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
                <li>관리자가 주문 내용을 검토합니다.</li>
                <li>승인이 완료되면 결제 페이지로 이동합니다.</li>
                <li>결제 완료 후 구매 대행이 진행됩니다.</li>
                <li>상품 도착 시 알림을 받게 됩니다.</li>
              </ol>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                * 데모 목적으로, 아래 버튼을 클릭하여 관리자 승인을 시뮬레이션할 수 있습니다.
              </p>
              <Button onClick={handleAdminApproval}>관리자 승인 시뮬레이션</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
