"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, FileText, AlertCircle, MessageSquare } from "lucide-react"
import { VendorSidebar } from "@/components/vendor/sidebar"
import { ChatModal } from "@/components/chat/chat-modal"

// 견적 요청 데이터 타입 정의
type QuoteRequest = {
  id: string
  customerId: string
  customerName: string
  customerAvatar?: string
  productName: string
  category: string
  quantity: number
  requestDate: Date
  status: "pending" | "viewed" | "quoted" | "rejected"
  urgency: "low" | "medium" | "high"
  description: string
  attachments?: number
  budget?: number
  deliveryDate?: Date
}

// 임시 견적 요청 데이터
const mockQuoteRequests: QuoteRequest[] = [
  {
    id: "QR001",
    customerId: "C001",
    customerName: "김고객",
    customerAvatar: "/mystical-forest-spirit.png",
    productName: "스마트폰 케이스",
    category: "전자기기",
    quantity: 500,
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    status: "pending",
    urgency: "high",
    description: "아이폰 14 모델용 투명 케이스와 블랙 케이스가 필요합니다. 로고 인쇄 가능 여부도 알려주세요.",
    attachments: 2,
    budget: 5000000,
    deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14일 후
  },
  {
    id: "QR002",
    customerId: "C002",
    customerName: "이구매자",
    customerAvatar: "/diverse-group-city.png",
    productName: "면 티셔츠",
    category: "의류",
    quantity: 300,
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
    status: "viewed",
    urgency: "medium",
    description: "S, M, L, XL 사이즈 각각 75장씩 필요합니다. 흰색, 검정색, 회색, 네이비 색상으로 요청드립니다.",
    budget: 3000000,
    deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21), // 21일 후
  },
  {
    id: "QR003",
    customerId: "C003",
    customerName: "박바이어",
    customerAvatar: "/diverse-shoppers-market.png",
    productName: "LED 조명",
    category: "인테리어",
    quantity: 100,
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    status: "quoted",
    urgency: "low",
    description: "실내용 LED 스트립 조명 100m가 필요합니다. 웜화이트와 쿨화이트 두 가지로 각각 50m씩 요청드립니다.",
    attachments: 1,
    budget: 2000000,
    deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30일 후
  },
  {
    id: "QR004",
    customerId: "C004",
    customerName: "최소매",
    customerAvatar: "/diverse-retail-setting.png",
    productName: "블루투스 이어폰",
    category: "전자기기",
    quantity: 200,
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5일 전
    status: "rejected",
    urgency: "medium",
    description:
      "무선 블루투스 이어폰 200개가 필요합니다. 블랙 색상으로 요청드립니다. 배터리 지속시간이 최소 5시간 이상인 제품을 찾고 있습니다.",
    budget: 4000000,
    deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10일 후
  },
  {
    id: "QR005",
    customerId: "C005",
    customerName: "정도매",
    customerAvatar: "/bustling-warehouse-distribution.png",
    productName: "스마트워치",
    category: "전자기기",
    quantity: 100,
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12시간 전
    status: "pending",
    urgency: "high",
    description: "심박수 측정 기능이 있는 스마트워치 100개가 필요합니다. 블랙, 실버, 골드 색상으로 각각 요청드립니다.",
    attachments: 3,
    budget: 8000000,
    deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7일 후
  },
]

export default function VendorQuotesListPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string
    name: string
    avatar?: string
  } | null>(null)

  // 필터링된 견적 요청 목록
  const filteredQuotes = mockQuoteRequests.filter((quote) => {
    // 검색어 필터링
    const searchMatch =
      quote.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.description.toLowerCase().includes(searchTerm.toLowerCase())

    // 카테고리 필터링
    const categoryMatch = selectedCategory === "all" || quote.category === selectedCategory

    // 상태 필터링
    const statusMatch = selectedStatus === "all" || quote.status === selectedStatus

    // 긴급도 필터링
    const urgencyMatch = selectedUrgency === "all" || quote.urgency === selectedUrgency

    return searchMatch && categoryMatch && statusMatch && urgencyMatch
  })

  // 정렬
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return a.requestDate.getTime() - b.requestDate.getTime()
      case "date-desc":
        return b.requestDate.getTime() - a.requestDate.getTime()
      case "quantity-asc":
        return a.quantity - b.quantity
      case "quantity-desc":
        return b.quantity - a.quantity
      case "budget-asc":
        return (a.budget || 0) - (b.budget || 0)
      case "budget-desc":
        return (b.budget || 0) - (a.budget || 0)
      default:
        return 0
    }
  })

  // 견적 상태에 따른 배지 스타일
  const getStatusBadge = (status: QuoteRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            대기 중
          </Badge>
        )
      case "viewed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            검토 중
          </Badge>
        )
      case "quoted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            견적 완료
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            거절됨
          </Badge>
        )
    }
  }

  // 긴급도에 따른 배지 스타일
  const getUrgencyBadge = (urgency: QuoteRequest["urgency"]) => {
    switch (urgency) {
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            낮음
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            중간
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            높음
          </Badge>
        )
    }
  }

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // 견적 작성 페이지로 이동
  const handleCreateQuote = (quoteId: string) => {
    router.push(`/vendor/quotes/${quoteId}`)
  }

  const handleOpenChat = (customer: { id: string; name: string; avatar?: string }) => {
    setSelectedCustomer(customer)
    setIsChatModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">견적 요청 목록</h1>

          {/* 필터 및 검색 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                <SelectItem value="전자기기">전자기기</SelectItem>
                <SelectItem value="의류">의류</SelectItem>
                <SelectItem value="인테리어">인테리어</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="pending">대기 중</SelectItem>
                <SelectItem value="viewed">검토 중</SelectItem>
                <SelectItem value="quoted">견적 완료</SelectItem>
                <SelectItem value="rejected">거절됨</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="긴급도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 긴급도</SelectItem>
                <SelectItem value="low">낮음</SelectItem>
                <SelectItem value="medium">중간</SelectItem>
                <SelectItem value="high">높음</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 정렬 옵션 */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">총 {sortedQuotes.length}개의 견적 요청</div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">최신순</SelectItem>
                <SelectItem value="date-asc">오래된순</SelectItem>
                <SelectItem value="quantity-desc">수량 많은순</SelectItem>
                <SelectItem value="quantity-asc">수량 적은순</SelectItem>
                <SelectItem value="budget-desc">예산 높은순</SelectItem>
                <SelectItem value="budget-asc">예산 낮은순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 견적 요청 목록 */}
          <div className="space-y-4">
            {sortedQuotes.length > 0 ? (
              sortedQuotes.map((quote) => (
                <Card key={quote.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                      {/* 기본 정보 */}
                      <div className="p-4 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={quote.customerAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{quote.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{quote.customerName}</h3>
                              {getStatusBadge(quote.status)}
                              {getUrgencyBadge(quote.urgency)}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">요청일: {formatDate(quote.requestDate)}</p>
                            <h4 className="font-medium mb-1">
                              {quote.productName} ({quote.quantity.toLocaleString()}개)
                            </h4>
                            <p className="text-sm text-gray-700 line-clamp-2">{quote.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* 상세 정보 */}
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">상세 정보</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center justify-between">
                            <span className="text-gray-500">카테고리:</span>
                            <span>{quote.category}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-gray-500">수량:</span>
                            <span>{quote.quantity.toLocaleString()}개</span>
                          </li>
                          {quote.budget && (
                            <li className="flex items-center justify-between">
                              <span className="text-gray-500">예산:</span>
                              <span>
                                {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
                                  quote.budget,
                                )}
                              </span>
                            </li>
                          )}
                          {quote.deliveryDate && (
                            <li className="flex items-center justify-between">
                              <span className="text-gray-500">납기일:</span>
                              <span>
                                {new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(
                                  quote.deliveryDate,
                                )}
                              </span>
                            </li>
                          )}
                          {quote.attachments && (
                            <li className="flex items-center justify-between">
                              <span className="text-gray-500">첨부파일:</span>
                              <span>{quote.attachments}개</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="p-4 flex flex-col justify-center">
                        <div className="space-y-2">
                          <Button
                            className="w-full"
                            onClick={() => handleCreateQuote(quote.id)}
                            disabled={quote.status === "rejected"}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            견적 작성
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                              handleOpenChat({
                                id: quote.customerId,
                                name: quote.customerName,
                                avatar: quote.customerAvatar,
                              })
                            }
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            채팅하기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">견적 요청이 없습니다</h3>
                <p className="text-gray-500">필터 조건을 변경하거나 나중에 다시 확인해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={selectedCustomer?.id}
        vendorName={selectedCustomer?.name}
        vendorAvatar={selectedCustomer?.avatar}
      />
    </div>
  )
}
