"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Send, User, Mail, Calendar, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 모킹된 문의 데이터 (app/admin/inquiries/page.tsx에서 가져옴)
const mockInquiries = [
  {
    id: "inq-001",
    userId: "user-1",
    userName: "테스트 사용자",
    email: "test@test.com",
    type: "product",
    subject: "[상품 문의] 프리미엄 스마트폰 케이스 도매 (100개 단위)",
    content: "해당 상품의 색상 옵션에 대해 문의드립니다. 블랙 외에 다른 색상도 가능한가요?",
    status: "pending",
    createdAt: "2024-02-15T09:30:00Z",
    updatedAt: "2024-02-15T09:30:00Z",
    productId: "prod-001",
    orderId: null,
  },
  {
    id: "inq-002",
    userId: "user-2",
    userName: "홍길동",
    email: "hong@example.com",
    type: "order",
    subject: "[주문 문의] LED 스마트 조명 도매 (20개 단위) (주문번호: order-2)",
    content: "주문한 상품의 배송이 예상보다 지연되고 있습니다. 현재 배송 상태를 확인 부탁드립니다.",
    status: "answered",
    createdAt: "2024-02-10T14:20:00Z",
    updatedAt: "2024-02-11T10:15:00Z",
    productId: "prod-003",
    orderId: "order-2",
    answer:
      "안녕하세요 홍길동 고객님, 주문하신 상품은 현재 통관 절차 중에 있습니다. 1-2일 내로 배송이 시작될 예정입니다. 불편을 드려 죄송합니다.",
  },
  {
    id: "inq-003",
    userId: "user-3",
    userName: "김철수",
    email: "kim@example.com",
    type: "payment",
    subject: "[결제 문의] 결제 오류 발생",
    content: "상품 결제 중 오류가 발생했습니다. 카드 결제는 되었는데 주문 내역에는 반영되지 않았습니다.",
    status: "pending",
    createdAt: "2024-02-18T16:45:00Z",
    updatedAt: "2024-02-18T16:45:00Z",
    productId: null,
    orderId: null,
  },
  {
    id: "inq-004",
    userId: "user-4",
    userName: "이영희",
    email: "lee@example.com",
    type: "return",
    subject: "[반품/교환 문의] 스마트 워치 OEM 생산 (30개 단위)",
    content: "받은 상품 중 일부에 불량이 있어 교환을 원합니다. 어떤 절차로 진행해야 하나요?",
    status: "answered",
    createdAt: "2024-02-05T11:10:00Z",
    updatedAt: "2024-02-06T09:30:00Z",
    productId: "prod-008",
    orderId: "order-8",
    answer:
      "안녕하세요 이영희 고객님, 불량 상품에 대한 사진과 함께 정확한 수량을 회신해주시면 교환 절차를 안내해드리겠습니다.",
  },
  {
    id: "inq-005",
    userId: "user-5",
    userName: "박민수",
    email: "park@example.com",
    type: "general",
    subject: "[일반 문의] 대량 구매 할인 문의",
    content: "여러 상품을 대량으로 구매할 경우 추가 할인이 가능한지 문의드립니다.",
    status: "pending",
    createdAt: "2024-02-20T13:25:00Z",
    updatedAt: "2024-02-20T13:25:00Z",
    productId: null,
    orderId: null,
  },
]

export default function AdminInquiryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [inquiry, setInquiry] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inquiryId = params.id as string

  useEffect(() => {
    const fetchInquiryDetail = async () => {
      try {
        // 모킹된 데이터에서 문의 찾기
        const foundInquiry = mockInquiries.find((inq) => inq.id === inquiryId)

        if (foundInquiry) {
          setInquiry(foundInquiry)
          if (foundInquiry.answer) {
            setAnswer(foundInquiry.answer)
          }
        } else {
          toast({
            title: "오류 발생",
            description: "문의 정보를 찾을 수 없습니다.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "문의 정보를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInquiryDetail()
  }, [inquiryId, toast])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "상품 문의"
      case "order":
        return "주문/배송 문의"
      case "payment":
        return "결제 문의"
      case "return":
        return "반품/교환 문의"
      case "general":
        return "일반 문의"
      default:
        return "기타 문의"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "답변을 입력해주세요",
        description: "답변 내용을 입력해야 합니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 문의 상태 업데이트 (모킹)
      setInquiry({
        ...inquiry,
        status: "answered",
        answer: answer,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "답변 등록 완료",
        description: "문의에 대한 답변이 등록되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "답변 등록 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">문의 상세</h1>
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

  if (!inquiry) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">문의 상세</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold mb-2">문의를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 문의 정보를 찾을 수 없습니다.</p>
            <Button onClick={() => router.push("/admin/inquiries")}>문의 목록으로 돌아가기</Button>
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
        <h1 className="text-3xl font-bold">문의 상세</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{inquiry.subject}</CardTitle>
            <Badge variant={inquiry.status === "answered" ? "success" : "warning"}>
              {inquiry.status === "answered" ? "답변완료" : "대기중"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">문의자:</span>
                <span>{inquiry.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">이메일:</span>
                <span>{inquiry.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">유형:</span>
                <span>{getTypeLabel(inquiry.type)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">문의일:</span>
                <span>{formatDate(inquiry.createdAt)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">문의 내용</h3>
              <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{inquiry.content}</div>
            </div>

            {inquiry.status === "answered" && (
              <div>
                <h3 className="text-lg font-medium mb-2">답변 내용</h3>
                <div className="p-4 bg-primary/10 rounded-md whitespace-pre-wrap">{inquiry.answer}</div>
                <p className="text-sm text-muted-foreground mt-2">답변일: {formatDate(inquiry.updatedAt)}</p>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">{inquiry.status === "answered" ? "답변 수정" : "답변 작성"}</h3>
              <Textarea
                placeholder="문의에 대한 답변을 작성해주세요"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                className="mb-4"
              />
              <Button onClick={handleSubmitAnswer} disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {inquiry.status === "answered" ? "답변 수정하기" : "답변 등록하기"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
