"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, FileText, MessageSquare, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChatModal } from "@/components/chat/chat-modal"

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const { user } = useVendorAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    price: "",
    deliveryDays: "",
    description: "",
    additionalNotes: "",
  })
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // 견적 요청 상세 정보 (실제로는 API에서 가져와야 함)
  const quoteRequest = {
    id: params.id,
    customerName: "홍길동",
    customerEmail: "hong@example.com",
    productName: "스마트폰 케이스 (500개)",
    requestDate: "2023-04-20",
    deadline: "2023-04-25",
    status: "new",
    details: `
      - 제품: 아이폰 14 Pro 케이스
      - 수량: 500개
      - 색상: 블랙, 화이트, 네이비 (각 색상별 약 170개씩)
      - 재질: 실리콘 또는 TPU
      - 로고 인쇄 필요
      - 개별 포장 필요
    `,
    attachments: [
      { name: "제품 디자인.pdf", url: "#" },
      { name: "로고 파일.png", url: "#" },
    ],
    customerId: "customer123", // 가상의 고객 ID
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // 실제로는 API 호출로 견적 제출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 성공 시 견적 목록 페이지로 이동
      router.push("/vendor/quotes")
    } catch (err) {
      setError("견적 제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/vendor/quotes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">견적 상세 - {params.id}</h1>
        <Badge>{quoteRequest.status === "new" ? "신규" : "처리 중"}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>견적 요청 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">고객명</p>
                <p>{quoteRequest.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">이메일</p>
                <p>{quoteRequest.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">요청일</p>
                <p>{quoteRequest.requestDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">마감일</p>
                <p className="font-medium text-red-500">{quoteRequest.deadline}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">상품명</p>
              <p className="font-medium">{quoteRequest.productName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">상세 요구사항</p>
              <pre className="mt-1 whitespace-pre-wrap rounded bg-muted p-2 text-sm">{quoteRequest.details}</pre>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">첨부 파일</p>
              <div className="mt-1 space-y-2">
                {quoteRequest.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <a href={file.url} className="text-sm text-blue-600 hover:underline">
                      {file.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full gap-2" onClick={() => setIsChatModalOpen(true)}>
              <MessageSquare className="h-4 w-4" />
              고객과 채팅하기
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>견적 작성</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">견적 금액 (원)</Label>
                <Input
                  id="price"
                  name="price"
                  placeholder="예: 2500000"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDays">예상 배송 기간 (일)</Label>
                <Input
                  id="deliveryDays"
                  name="deliveryDays"
                  placeholder="예: 7"
                  value={formData.deliveryDays}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">견적 설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="견적에 대한 상세 설명을 입력하세요."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">추가 참고사항</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  placeholder="추가 참고사항이 있다면 입력하세요."
                  rows={2}
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/vendor/quotes")}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
              <Send className="h-4 w-4" />
              {isSubmitting ? "제출 중..." : "견적 제출하기"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={quoteRequest.customerId}
        vendorName={quoteRequest.customerName}
        vendorAvatar={undefined} // 실제 구현에서는 고객 아바타 정보를 추가해야 합니다
      />
    </div>
  )
}
