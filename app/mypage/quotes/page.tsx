"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MessageSquare, ChevronRight, ArrowUpDown, CheckCircle2, XCircle, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/auth-context"
import { ChatModal } from "@/components/chat/chat-modal"

// 견적 상태에 따른 배지 색상 및 아이콘
const statusConfig = {
  대기중: { color: "bg-yellow-100 text-yellow-800", icon: <Clock3 className="h-4 w-4 mr-1" /> },
  견적완료: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
  거절됨: { color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4 mr-1" /> },
}

// 모의 데이터: 견적 요청 목록
const mockQuoteRequests = [
  {
    id: "q1",
    productName: "스마트폰 케이스 (500개)",
    requestDate: "2023-04-15",
    status: "견적완료",
    description: "다양한 색상의 아이폰 13 케이스 대량 구매를 위한 견적 요청",
    budget: "5,000,000원",
    deadline: "2023-04-30",
    quotes: [
      {
        id: "v1",
        vendorName: "테크 액세서리",
        vendorId: "vendor1",
        vendorAvatar: "/abstract-blue-logo.png",
        price: "4,750,000원",
        deliveryDate: "2023-05-10",
        rating: 4.8,
        message: "고품질 실리콘 케이스로 제작해 드립니다. 로고 인쇄 무료 서비스 포함.",
      },
      {
        id: "v2",
        vendorName: "모바일 월드",
        vendorId: "vendor2",
        vendorAvatar: "/abstract-green-logo.png",
        price: "4,500,000원",
        deliveryDate: "2023-05-15",
        rating: 4.5,
        message: "대량 주문 할인 적용된 가격입니다. 추가 색상당 10만원 추가됩니다.",
      },
    ],
  },
  {
    id: "q2",
    productName: "무선 이어폰 (200개)",
    requestDate: "2023-04-10",
    status: "대기중",
    description: "블루투스 5.0 지원 무선 이어폰 대량 구매 견적 요청",
    budget: "8,000,000원",
    deadline: "2023-04-25",
    quotes: [],
  },
  {
    id: "q3",
    productName: "노트북 파우치 (300개)",
    requestDate: "2023-04-05",
    status: "견적완료",
    description: "15인치 노트북용 방수 파우치, 로고 인쇄 필요",
    budget: "3,000,000원",
    deadline: "2023-04-20",
    quotes: [
      {
        id: "v3",
        vendorName: "디지털 액세서리",
        vendorId: "vendor3",
        vendorAvatar: "/abstract-red-logo.png",
        price: "2,850,000원",
        deliveryDate: "2023-05-05",
        rating: 4.7,
        message: "방수 및 충격 방지 소재로 제작, 로고 인쇄 포함 가격입니다.",
      },
    ],
  },
  {
    id: "q4",
    productName: "사무용 의자 (50개)",
    requestDate: "2023-04-01",
    status: "거절됨",
    description: "인체공학적 디자인의 사무용 의자, 조절 가능한 팔걸이 필요",
    budget: "7,500,000원",
    deadline: "2023-04-15",
    quotes: [],
  },
]

export default function QuotesPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [openQuoteId, setOpenQuoteId] = useState<string | null>(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  // 견적 요청 필터링
  const filteredQuotes = mockQuoteRequests.filter((quote) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return quote.status === "대기중"
    if (activeTab === "completed") return quote.status === "견적완료"
    if (activeTab === "rejected") return quote.status === "거절됨"
    return true
  })

  // 견적 요청 정렬
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    }
    if (sortBy === "budget") {
      const budgetA = Number.parseInt(a.budget.replace(/[^0-9]/g, ""))
      const budgetB = Number.parseInt(b.budget.replace(/[^0-9]/g, ""))
      return budgetB - budgetA
    }
    if (sortBy === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    return 0
  })

  const handleOpenChat = (vendor: any) => {
    setSelectedVendor(vendor)
    setIsChatModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">내 견적 요청</h1>
          <Button onClick={() => router.push("/purchase")} variant="outline">
            새 견적 요청
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="pending">대기중</TabsTrigger>
                <TabsTrigger value="completed">견적완료</TabsTrigger>
                <TabsTrigger value="rejected">거절됨</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">최신순</SelectItem>
                  <SelectItem value="budget">예산순</SelectItem>
                  <SelectItem value="deadline">마감일순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {sortedQuotes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-muted-foreground">견적 요청 내역이 없습니다.</p>
            <Button onClick={() => router.push("/purchase")} className="mt-4">
              견적 요청하기
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedQuotes.map((quote) => (
              <Card key={quote.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{quote.productName}</CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            요청일: {quote.requestDate}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            마감일: {quote.deadline}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${statusConfig[quote.status as keyof typeof statusConfig].color} flex items-center`}
                    >
                      {statusConfig[quote.status as keyof typeof statusConfig].icon}
                      {quote.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground mb-2">{quote.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50">
                      예산: {quote.budget}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="text-sm text-muted-foreground">
                    {quote.quotes.length > 0
                      ? `${quote.quotes.length}개의 견적 제안 받음`
                      : "아직 견적 제안이 없습니다"}
                  </div>
                  <Dialog
                    open={openQuoteId === quote.id}
                    onOpenChange={(open) => setOpenQuoteId(open ? quote.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        견적 보기 <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>견적 제안 목록 - {quote.productName}</DialogTitle>
                        <DialogDescription>
                          요청일: {quote.requestDate} | 마감일: {quote.deadline} | 예산: {quote.budget}
                        </DialogDescription>
                      </DialogHeader>

                      {quote.quotes.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">아직 견적 제안이 없습니다.</p>
                        </div>
                      ) : (
                        <div className="space-y-4 mt-4">
                          {quote.quotes.map((vendor) => (
                            <Card key={vendor.id} className="overflow-hidden">
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                      <img
                                        src={vendor.vendorAvatar || "/placeholder.svg"}
                                        alt={vendor.vendorName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg">{vendor.vendorName}</CardTitle>
                                      <div className="flex items-center mt-1">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <svg
                                              key={i}
                                              className={`w-4 h-4 ${
                                                i < Math.floor(vendor.rating) ? "text-yellow-400" : "text-gray-300"
                                              }`}
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                          ))}
                                          <span className="ml-1 text-xs text-gray-500">{vendor.rating}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800">{vendor.price}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-3">
                                <p className="text-sm">{vendor.message}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <Badge variant="outline" className="bg-blue-50">
                                    배송 예정일: {vendor.deliveryDate}
                                  </Badge>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between pt-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => handleOpenChat(vendor)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  채팅하기
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/purchase/payment?orderId=${quote.id}&quoteId=${vendor.id}`)
                                  }
                                >
                                  견적 선택하기
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedVendor && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          vendorId={selectedVendor.vendorId}
          vendorName={selectedVendor.vendorName}
          vendorAvatar={selectedVendor.vendorAvatar}
        />
      )}
    </div>
  )
}
