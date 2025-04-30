"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  X,
  AlertCircle,
  Package,
  ArrowUpDown,
  Filter,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockProducts } from "@/lib/mock-data"
import type { ProductData } from "@/lib/types"

// 견적 요청 그룹 타입 정의
interface QuoteGroup {
  id: string
  requestDate: string
  expiryDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: "pending" | "approved" | "rejected" | "expired" | "completed"
  productIds: string[]
  products: {
    id: string
    name: string
    quantity: number
    additionalNotes?: string
  }[]
  vendorQuotes: {
    vendorId: string
    vendorName: string
    totalAmount: number
    estimatedDelivery: string
    status: string
    submittedAt: string
  }[]
}

export default function AdminQuotesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<ProductData[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [expandedProducts, setExpandedProducts] = useState<string[]>([])
  const [selectedQuoteGroup, setSelectedQuoteGroup] = useState<QuoteGroup | null>(null)
  const [isQuoteDetailOpen, setIsQuoteDetailOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)

  // 모의 데이터: 견적 요청 그룹
  const [quoteGroups, setQuoteGroups] = useState<QuoteGroup[]>([
    {
      id: "Q-2023-001",
      requestDate: "2023-05-15",
      expiryDate: "2023-05-22",
      customerName: "김철수",
      customerEmail: "kim@example.com",
      customerPhone: "010-1234-5678",
      status: "pending",
      productIds: [mockProducts[0].id, mockProducts[1].id, mockProducts[2].id],
      products: [
        {
          id: mockProducts[0].id,
          name: mockProducts[0].title || "스마트폰 케이스",
          quantity: 500,
          additionalNotes: "블랙 색상 위주로 구매하고 싶습니다.",
        },
        {
          id: mockProducts[1].id,
          name: mockProducts[1].title || "블루투스 이어폰",
          quantity: 200,
          additionalNotes: "로고 인쇄가 가능한지 확인 부탁드립니다.",
        },
        {
          id: mockProducts[2].id,
          name: mockProducts[2].title || "보조배터리",
          quantity: 300,
        },
      ],
      vendorQuotes: [
        {
          vendorId: "vendor-1",
          vendorName: "키키퍼 로지스틱스",
          totalAmount: 8500000,
          estimatedDelivery: "3-5일",
          status: "submitted",
          submittedAt: "2023-05-16",
        },
        {
          vendorId: "vendor-2",
          vendorName: "글로벌 트레이딩",
          totalAmount: 9200000,
          estimatedDelivery: "2-4일",
          status: "submitted",
          submittedAt: "2023-05-17",
        },
        {
          vendorId: "vendor-3",
          vendorName: "스마트 임포트",
          totalAmount: 8100000,
          estimatedDelivery: "4-7일",
          status: "pending",
          submittedAt: "",
        },
      ],
    },
    {
      id: "Q-2023-002",
      requestDate: "2023-05-16",
      expiryDate: "2023-05-23",
      customerName: "이영희",
      customerEmail: "lee@example.com",
      customerPhone: "010-2345-6789",
      status: "approved",
      productIds: [mockProducts[5].id, mockProducts[6].id],
      products: [
        {
          id: mockProducts[5].id,
          name: mockProducts[5].title || "노트북 파우치",
          quantity: 150,
        },
        {
          id: mockProducts[6].id,
          name: mockProducts[6].title || "무선 충전기",
          quantity: 400,
          additionalNotes: "빠른 충전 지원 모델로 요청드립니다.",
        },
      ],
      vendorQuotes: [
        {
          vendorId: "vendor-1",
          vendorName: "키키퍼 로지스틱스",
          totalAmount: 7200000,
          estimatedDelivery: "3-5일",
          status: "selected",
          submittedAt: "2023-05-17",
        },
        {
          vendorId: "vendor-4",
          vendorName: "테크 솔루션",
          totalAmount: 7500000,
          estimatedDelivery: "2-3일",
          status: "submitted",
          submittedAt: "2023-05-18",
        },
      ],
    },
    {
      id: "Q-2023-003",
      requestDate: "2023-05-18",
      expiryDate: "2023-05-25",
      customerName: "박지민",
      customerEmail: "park@example.com",
      customerPhone: "010-3456-7890",
      status: "rejected",
      productIds: [mockProducts[3].id],
      products: [
        {
          id: mockProducts[3].id,
          name: mockProducts[3].title || "스마트 워치",
          quantity: 100,
          additionalNotes: "방수 기능이 있는 모델로 요청드립니다.",
        },
      ],
      vendorQuotes: [
        {
          vendorId: "vendor-2",
          vendorName: "글로벌 트레이딩",
          totalAmount: 5500000,
          estimatedDelivery: "5-7일",
          status: "rejected",
          submittedAt: "2023-05-19",
        },
      ],
    },
    {
      id: "Q-2023-004",
      requestDate: "2023-05-20",
      expiryDate: "2023-05-27",
      customerName: "최수진",
      customerEmail: "choi@example.com",
      customerPhone: "010-4567-8901",
      status: "expired",
      productIds: [mockProducts[4].id, mockProducts[7].id, mockProducts[8].id],
      products: [
        {
          id: mockProducts[4].id,
          name: mockProducts[4].title || "태블릿 케이스",
          quantity: 250,
        },
        {
          id: mockProducts[7].id,
          name: mockProducts[7].title || "블루투스 스피커",
          quantity: 150,
        },
        {
          id: mockProducts[8].id,
          name: mockProducts[8].title || "스마트폰 거치대",
          quantity: 300,
        },
      ],
      vendorQuotes: [],
    },
    {
      id: "Q-2023-005",
      requestDate: "2023-05-22",
      expiryDate: "2023-05-29",
      customerName: "정민수",
      customerEmail: "jung@example.com",
      customerPhone: "010-5678-9012",
      status: "completed",
      productIds: [mockProducts[9].id],
      products: [
        {
          id: mockProducts[9].id,
          name: mockProducts[9].title || "무선 마우스",
          quantity: 200,
        },
      ],
      vendorQuotes: [
        {
          vendorId: "vendor-1",
          vendorName: "키키퍼 로지스틱스",
          totalAmount: 3800000,
          estimatedDelivery: "2-4일",
          status: "completed",
          submittedAt: "2023-05-23",
        },
        {
          vendorId: "vendor-3",
          vendorName: "스마트 임포트",
          totalAmount: 3600000,
          estimatedDelivery: "3-6일",
          status: "submitted",
          submittedAt: "2023-05-24",
        },
      ],
    },
  ])

  // 견적 요청 그룹 필터링
  const filteredQuoteGroups = quoteGroups.filter((group) => {
    // 검색어 필터링
    const matchesSearch =
      group.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.products.some((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

    // 상태 필터링
    const matchesStatus = statusFilter === "all" || group.status === statusFilter

    // 날짜 필터링
    let matchesDate = true
    if (dateFilter !== "all") {
      const today = new Date()
      const requestDate = new Date(group.requestDate)
      const diffTime = Math.abs(today.getTime() - requestDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (dateFilter === "today" && diffDays !== 0) matchesDate = false
      else if (dateFilter === "week" && diffDays > 7) matchesDate = false
      else if (dateFilter === "month" && diffDays > 30) matchesDate = false
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  // 상품이 속한 견적 요청 그룹 찾기
  const findQuoteGroup = (productId: string) => {
    return quoteGroups.find((group) => group.productIds.includes(productId))
  }

  // 견적 요청 그룹 확장/축소 토글
  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  // 상품 확장/축소 토글
  const toggleProductExpand = (productId: string) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  // 견적 요청 그룹 상세보기
  const handleViewQuoteDetail = (group: QuoteGroup) => {
    setSelectedQuoteGroup(group)
    setIsQuoteDetailOpen(true)
  }

  // 견적 상태 변경
  const handleStatusChange = (
    groupId: string,
    newStatus: "pending" | "approved" | "rejected" | "expired" | "completed",
  ) => {
    setQuoteGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, status: newStatus } : group)))

    toast({
      title: "견적 상태 변경 완료",
      description: `견적 요청 ${groupId}의 상태가 ${getStatusLabel(newStatus)}(으)로 변경되었습니다.`,
    })
  }

  // 견적 삭제
  const handleDeleteQuote = (groupId: string) => {
    setQuoteGroups((prev) => prev.filter((group) => group.id !== groupId))

    toast({
      title: "견적 요청 삭제 완료",
      description: `견적 요청 ${groupId}이(가) 삭제되었습니다.`,
    })
  }

  // 상품 삭제 다이얼로그 열기
  const handleDeleteClick = (product: ProductData) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  // 상품 삭제 확인
  const handleDeleteConfirm = () => {
    // 실제 구현에서는 API 호출
    const updatedProducts = products.filter((p) => p.id !== selectedProduct?.id)
    setProducts(updatedProducts)
    setIsDeleteDialogOpen(false)

    toast({
      title: "상품 삭제 완료",
      description: "상품이 성공적으로 삭제되었습니다.",
    })
  }

  // 상태 라벨 가져오기
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "대기 중"
      case "approved":
        return "승인됨"
      case "rejected":
        return "거절됨"
      case "expired":
        return "만료됨"
      case "completed":
        return "완료됨"
      default:
        return status
    }
  }

  // 상태 배지 가져오기
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>대기 중</span>
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300">
            <CheckCircle className="h-3 w-3" />
            <span>승인됨</span>
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>거절됨</span>
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-800">
            <AlertCircle className="h-3 w-3" />
            <span>만료됨</span>
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3" />
            <span>완료됨</span>
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300">
            <CheckCircle className="h-3 w-3" />
            <span>제출됨</span>
          </Badge>
        )
      case "selected":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3" />
            <span>선택됨</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">견적 관리</h1>
          <p className="text-muted-foreground mt-1">모든 판매자와 구매자 사이의 견적 요청을 관리합니다.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />새 견적 요청 등록
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="견적 ID, 고객명 또는 상품명으로 검색"
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
              <SelectItem value="pending">대기 중</SelectItem>
              <SelectItem value="approved">승인됨</SelectItem>
              <SelectItem value="rejected">거절됨</SelectItem>
              <SelectItem value="expired">만료됨</SelectItem>
              <SelectItem value="completed">완료됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="날짜 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 날짜</SelectItem>
              <SelectItem value="today">오늘</SelectItem>
              <SelectItem value="week">최근 7일</SelectItem>
              <SelectItem value="month">최근 30일</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="quotes">
        <TabsList>
          <TabsTrigger value="quotes">견적 요청 목록</TabsTrigger>
          <TabsTrigger value="products">관련 상품 목록</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>견적 요청 그룹</CardTitle>
              <CardDescription>총 {filteredQuoteGroups.length}개의 견적 요청이 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>견적 ID</TableHead>
                      <TableHead>요청일</TableHead>
                      <TableHead>고객명</TableHead>
                      <TableHead>상품 수</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          상태
                          <Button variant="ghost" size="sm" className="ml-1 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead>견적 수</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuoteGroups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuoteGroups.map((group) => (
                        <>
                          <TableRow key={group.id}>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => toggleGroupExpand(group.id)}>
                                {expandedGroups.includes(group.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium">{group.id}</TableCell>
                            <TableCell>{group.requestDate}</TableCell>
                            <TableCell>{group.customerName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50">
                                {group.products.length}개 상품
                              </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(group.status)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-gray-50">
                                {group.vendorQuotes.length}개 견적
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewQuoteDetail(group)}>
                                  상세보기
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteQuote(group.id)}>
                                  삭제
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedGroups.includes(group.id) && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-gray-50 p-4">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">요청 상품 목록</h4>
                                    <div className="space-y-2">
                                      {group.products.map((product, idx) => (
                                        <div key={idx} className="border rounded-md p-3 bg-white">
                                          <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                              <Package className="h-4 w-4 text-gray-500" />
                                              <p className="font-medium">{product.name}</p>
                                            </div>
                                            <Badge variant="outline">수량: {product.quantity}개</Badge>
                                          </div>
                                          {product.additionalNotes && (
                                            <div className="mt-2 text-sm text-gray-600">
                                              <p className="font-medium text-xs text-gray-500">추가 요청사항:</p>
                                              <p>{product.additionalNotes}</p>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium mb-2">판매자 견적 현황</h4>
                                    {group.vendorQuotes.length > 0 ? (
                                      <div className="rounded-md border overflow-hidden">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>판매자</TableHead>
                                              <TableHead>견적 금액</TableHead>
                                              <TableHead>예상 배송일</TableHead>
                                              <TableHead>제출일</TableHead>
                                              <TableHead>상태</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {group.vendorQuotes.map((quote, idx) => (
                                              <TableRow
                                                key={idx}
                                                className={quote.vendorName === "키키퍼 로지스틱스" ? "bg-blue-50" : ""}
                                              >
                                                <TableCell className="font-medium">{quote.vendorName}</TableCell>
                                                <TableCell>{quote.totalAmount.toLocaleString()}원</TableCell>
                                                <TableCell>{quote.estimatedDelivery}</TableCell>
                                                <TableCell>{quote.submittedAt ? quote.submittedAt : "-"}</TableCell>
                                                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">아직 제출된 견적이 없습니다.</p>
                                    )}
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <Select
                                      defaultValue={group.status}
                                      onValueChange={(value: any) => handleStatusChange(group.id, value)}
                                    >
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="상태 변경" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">대기 중</SelectItem>
                                        <SelectItem value="approved">승인</SelectItem>
                                        <SelectItem value="rejected">거절</SelectItem>
                                        <SelectItem value="expired">만료</SelectItem>
                                        <SelectItem value="completed">완료</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button variant="outline" onClick={() => handleViewQuoteDetail(group)}>
                                      상세보기
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>관련 상품 목록</CardTitle>
              <CardDescription>견적 요청에 포함된 상품 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>이미지</TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>플랫폼</TableHead>
                      <TableHead>원가</TableHead>
                      <TableHead>예상 판매가</TableHead>
                      <TableHead>견적 요청</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => {
                        const quoteGroup = findQuoteGroup(product.id)
                        const isQuoted = !!quoteGroup

                        return (
                          <>
                            <TableRow key={product.id} className={isQuoted ? "bg-blue-50" : ""}>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => toggleProductExpand(product.id)}>
                                  {expandedProducts.includes(product.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                  <Image
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.title || ""}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="font-medium max-w-[200px] truncate">
                                {product.title}
                                {product.additionalNotes && (
                                  <Badge variant="outline" className="ml-2">
                                    추가 요청사항
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{product.platform || "Alibaba"}</TableCell>
                              <TableCell>{product.originalPrice?.toLocaleString()}원</TableCell>
                              <TableCell>
                                {isQuoted
                                  ? "견적 요청 중"
                                  : `${(product.estimatedPrice || Math.ceil(product.originalPrice * 1.3)).toLocaleString()}원`}
                              </TableCell>
                              <TableCell>
                                {isQuoted ? (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {quoteGroup.id}
                                  </Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">삭제</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            {expandedProducts.includes(product.id) && (
                              <TableRow>
                                <TableCell colSpan={8} className={isQuoted ? "bg-blue-50/50" : "bg-muted/30"}>
                                  <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium mb-2">상품 상세 정보</h4>
                                        <div className="space-y-2">
                                          <div className="grid grid-cols-3 gap-2">
                                            <span className="text-sm text-muted-foreground">수수료:</span>
                                            <span className="text-sm col-span-2">
                                              {product.fees?.toLocaleString()}원
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                            <span className="text-sm text-muted-foreground">관세:</span>
                                            <span className="text-sm col-span-2">
                                              {product.tax?.toLocaleString()}원
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                            <span className="text-sm text-muted-foreground">배송비:</span>
                                            <span className="text-sm col-span-2">
                                              {product.shippingCost?.toLocaleString()}원
                                            </span>
                                          </div>
                                          {product.originalUrl && (
                                            <div className="grid grid-cols-3 gap-2">
                                              <span className="text-sm text-muted-foreground">원본 URL:</span>
                                              <a
                                                href={product.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline flex items-center col-span-2"
                                              >
                                                링크 <ExternalLink className="h-3 w-3 ml-1" />
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      {product.additionalNotes && (
                                        <div>
                                          <h4 className="text-sm font-medium mb-2">구매자 추가 요청사항</h4>
                                          <div className="p-3 bg-muted rounded-md text-sm">
                                            {product.additionalNotes}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {quoteGroup && (
                                      <div>
                                        <h4 className="text-sm font-medium mb-2">견적 요청 정보</h4>
                                        <div className="p-3 bg-blue-100 rounded-md">
                                          <p className="text-sm mb-1">
                                            <span className="font-medium">견적 ID:</span> {quoteGroup.id}
                                          </p>
                                          <p className="text-sm mb-1">
                                            <span className="font-medium">요청일:</span> {quoteGroup.requestDate}
                                          </p>
                                          <p className="text-sm mb-1">
                                            <span className="font-medium">고객명:</span> {quoteGroup.customerName}
                                          </p>
                                          <p className="text-sm">
                                            <span className="font-medium">상태:</span>{" "}
                                            {getStatusLabel(quoteGroup.status)}
                                          </p>
                                          <div className="mt-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="bg-white"
                                              onClick={() => handleViewQuoteDetail(quoteGroup)}
                                            >
                                              견적 요청 상세보기
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 견적 요청 상세 다이얼로그 */}
      <Dialog open={isQuoteDetailOpen} onOpenChange={setIsQuoteDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>견적 요청 상세 - {selectedQuoteGroup?.id}</DialogTitle>
            <DialogDescription>견적 요청 상세 정보를 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedQuoteGroup && (
            <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">고객 정보</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">고객명</p>
                      <p className="font-medium">{selectedQuoteGroup.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">이메일</p>
                      <p className="font-medium">{selectedQuoteGroup.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">연락처</p>
                      <p className="font-medium">{selectedQuoteGroup.customerPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">견적 정보</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">요청일</p>
                      <p className="font-medium">{selectedQuoteGroup.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">만료일</p>
                      <p className="font-medium">{selectedQuoteGroup.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">상태</p>
                      <div>{getStatusBadge(selectedQuoteGroup.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">상품 수</p>
                      <p className="font-medium">{selectedQuoteGroup.products.length}개</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">요청 상품 목록</h3>
                <div className="space-y-3">
                  {selectedQuoteGroup.products.map((product, idx) => (
                    <div key={idx} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            상품 #{idx + 1}
                          </Badge>
                          <h4 className="font-medium">{product.name}</h4>
                        </div>
                        <Badge variant="outline">수량: {product.quantity}개</Badge>
                      </div>
                      {product.additionalNotes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-muted-foreground">추가 요청사항:</p>
                          <p className="text-sm p-2 bg-muted rounded-md mt-1">{product.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">판매자 견적 현황</h3>
                {selectedQuoteGroup.vendorQuotes.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>판매자</TableHead>
                          <TableHead>견적 금액</TableHead>
                          <TableHead>예상 배송일</TableHead>
                          <TableHead>제출일</TableHead>
                          <TableHead>상태</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQuoteGroup.vendorQuotes.map((quote, idx) => (
                          <TableRow key={idx} className={quote.vendorName === "키키퍼 로지스틱스" ? "bg-blue-50" : ""}>
                            <TableCell className="font-medium">{quote.vendorName}</TableCell>
                            <TableCell>{quote.totalAmount.toLocaleString()}원</TableCell>
                            <TableCell>{quote.estimatedDelivery}</TableCell>
                            <TableCell>{quote.submittedAt ? quote.submittedAt : "-"}</TableCell>
                            <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">아직 제출된 견적이 없습니다.</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">견적 상태 관리</h3>
                <div className="flex gap-2">
                  <Select
                    defaultValue={selectedQuoteGroup.status}
                    onValueChange={(value: any) => handleStatusChange(selectedQuoteGroup.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="상태 변경" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">대기 중</SelectItem>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="rejected">거절</SelectItem>
                      <SelectItem value="expired">만료</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">메시지 보내기</Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuoteDetailOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상품 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상품 삭제</DialogTitle>
            <DialogDescription>정말로 이 상품을 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <span className="font-medium">{selectedProduct?.title}</span> 상품을 삭제하면 복구할 수 없습니다.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
