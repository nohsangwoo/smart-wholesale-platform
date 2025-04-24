"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpDown, Eye, FileText, Clock, CheckCircle, X, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOrderDetails } from "@/lib/mock-data"
import { generateMockQuotes } from "@/lib/mock-vendors"
import { ChatModal } from "@/components/chat/chat-modal"

export default function VendorQuotesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({
    key: "createdAt",
    direction: "descending",
  })

  const [pendingQuotes, setPendingQuotes] = useState<any[]>([])
  const [submittedQuotes, setSubmittedQuotes] = useState<any[]>([])
  const [acceptedQuotes, setAcceptedQuotes] = useState<any[]>([])
  const [rejectedQuotes, setRejectedQuotes] = useState<any[]>([])
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    // 모의 데이터 로드
    loadMockData()
  }, [])

  const loadMockData = () => {
    // 모의 주문 데이터
    const orders = mockOrderDetails

    // 모의 견적 데이터 생성
    const allQuotes = orders.flatMap((order) => {
      try {
        return generateMockQuotes(order.id, order.product.originalPrice)
      } catch (error) {
        console.error("Error generating quotes for order:", order.id, error)
        return []
      }
    })

    // 이 업체의 견적만 필터링 (vendor-1)
    const vendorQuotes = allQuotes.filter((quote) => quote.vendorId === "vendor-1")

    // 견적 상태 랜덤 할당
    const enrichedQuotes = vendorQuotes.map((quote) => {
      const order = orders.find((o) => o.id === quote.orderId)
      const randomStatus = Math.random()
      let status = "pending" // 기본값: 대기 중

      if (randomStatus < 0.3) {
        status = "pending" // 30%: 대기 중
      } else if (randomStatus < 0.7) {
        status = "submitted" // 40%: 제출됨
      } else if (randomStatus < 0.9) {
        status = "accepted" // 20%: 수락됨
      } else {
        status = "rejected" // 10%: 거절됨
      }

      return {
        ...quote,
        status,
        productTitle: order?.product.title || "알 수 없는 상품",
        customerName: "고객 " + Math.floor(Math.random() * 100),
        customerId: "customer-" + Math.floor(Math.random() * 100),
      }
    })

    // 상태별로 분류
    setPendingQuotes(enrichedQuotes.filter((q) => q.status === "pending"))
    setSubmittedQuotes(enrichedQuotes.filter((q) => q.status === "submitted"))
    setAcceptedQuotes(enrichedQuotes.filter((q) => q.status === "accepted"))
    setRejectedQuotes(enrichedQuotes.filter((q) => q.status === "rejected"))
  }

  const getFilteredQuotes = (quotes: any[]) => {
    let result = [...quotes]

    // 검색어 필터링
    if (searchTerm) {
      result = result.filter(
        (quote) =>
          quote.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 정렬 적용
    result.sort((a, b) => {
      if (sortConfig.key === "createdAt") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA
      } else if (sortConfig.key === "price") {
        return sortConfig.direction === "ascending" ? a.price - b.price : b.price - a.price
      }
      return 0
    })

    return result
  }

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleOpenChat = (customerId: string, customerName: string) => {
    setSelectedCustomer({
      id: customerId,
      name: customerName,
    })
    setIsChatModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            견적 대기
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            제출됨
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            수락됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            거절됨
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">견적 관리</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="주문번호, 상품명 또는 고객명으로 검색"
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
              <SelectItem value="pending">견적 대기</SelectItem>
              <SelectItem value="submitted">제출됨</SelectItem>
              <SelectItem value="accepted">수락됨</SelectItem>
              <SelectItem value="rejected">거절됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            견적 대기
            {pendingQuotes.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{pendingQuotes.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="submitted">제출한 견적</TabsTrigger>
          <TabsTrigger value="accepted">수락된 견적</TabsTrigger>
          <TabsTrigger value="rejected">거절된 견적</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>견적 대기 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("createdAt")}>
                          요청일
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>고객명</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredQuotes(pendingQuotes).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          견적 대기 중인 요청이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredQuotes(pendingQuotes).map((quote) => (
                        <TableRow key={quote.orderId}>
                          <TableCell className="font-medium">{quote.orderId}</TableCell>
                          <TableCell>{formatDate(quote.createdAt)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{quote.productTitle}</TableCell>
                          <TableCell>{quote.customerName}</TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/quotes/${quote.orderId}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(quote.customerId, quote.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted">
          <Card>
            <CardHeader>
              <CardTitle>제출한 견적 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("createdAt")}>
                          요청일
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("price")}>
                          견적 금액
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredQuotes(submittedQuotes).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          제출한 견적이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredQuotes(submittedQuotes).map((quote) => (
                        <TableRow key={quote.orderId}>
                          <TableCell className="font-medium">{quote.orderId}</TableCell>
                          <TableCell>{formatDate(quote.createdAt)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{quote.productTitle}</TableCell>
                          <TableCell>{quote.price.toLocaleString()}원</TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/quotes/${quote.orderId}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(quote.customerId, quote.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted">
          <Card>
            <CardHeader>
              <CardTitle>수락된 견적 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("createdAt")}>
                          요청일
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("price")}>
                          견적 금액
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredQuotes(acceptedQuotes).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          수락된 견적이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredQuotes(acceptedQuotes).map((quote) => (
                        <TableRow key={quote.orderId}>
                          <TableCell className="font-medium">{quote.orderId}</TableCell>
                          <TableCell>{formatDate(quote.createdAt)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{quote.productTitle}</TableCell>
                          <TableCell>{quote.price.toLocaleString()}원</TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/quotes/${quote.orderId}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(quote.customerId, quote.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>거절된 견적 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("createdAt")}>
                          요청일
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("price")}>
                          견적 금액
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredQuotes(rejectedQuotes).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          거절된 견적이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredQuotes(rejectedQuotes).map((quote) => (
                        <TableRow key={quote.orderId}>
                          <TableCell className="font-medium">{quote.orderId}</TableCell>
                          <TableCell>{formatDate(quote.createdAt)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{quote.productTitle}</TableCell>
                          <TableCell>{quote.price.toLocaleString()}원</TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/quotes/${quote.orderId}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(quote.customerId, quote.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={selectedCustomer?.id}
        vendorName={selectedCustomer?.name}
      />
    </div>
  )
}
