"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 모킹된 문의 데이터
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

export default function AdminInquiriesPage() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState(mockInquiries)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredInquiries = inquiries.filter((inquiry) => {
    // 검색어 필터링
    const matchesSearch =
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())

    // 상태 필터링
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter

    // 유형 필터링
    const matchesType = typeFilter === "all" || inquiry.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">대기중</Badge>
      case "answered":
        return <Badge variant="success">답변완료</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

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
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">문의 관리</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>문의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 이름 또는 이메일로 검색"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="answered">답변완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="유형 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 유형</SelectItem>
                  <SelectItem value="product">상품 문의</SelectItem>
                  <SelectItem value="order">주문/배송 문의</SelectItem>
                  <SelectItem value="payment">결제 문의</SelectItem>
                  <SelectItem value="return">반품/교환 문의</SelectItem>
                  <SelectItem value="general">일반 문의</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>문의자</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>문의일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium max-w-[300px] truncate">{inquiry.subject}</TableCell>
                      <TableCell>{inquiry.userName}</TableCell>
                      <TableCell>{getTypeLabel(inquiry.type)}</TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/inquiries/${inquiry.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">상세보기</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
