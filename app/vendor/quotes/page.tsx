"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { VendorSidebar } from "@/components/vendor/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FileText, Clock, CheckCircle, X, AlertCircle } from "lucide-react"
import { ChatModal } from "@/components/chat/chat-modal"

export default function VendorQuotesPage() {
  const { isAuthenticated, isLoading } = useVendorAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null)

  const handleChatOpen = (customerId: string, customerName: string) => {
    setSelectedCustomer({ id: customerId, name: customerName })
    setIsChatModalOpen(true)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push("/vendor/login")
    }
  }, [isMounted, isAuthenticated, isLoading, router])

  // 로딩 중이거나 인증되지 않은 경우
  if (!isMounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  // 모의 견적 데이터
  const quotes = [
    {
      id: "Q-2023-001",
      products: [
        {
          productName: "스마트폰 케이스 (iPhone 14 Pro)",
          quantity: 500,
        },
      ],
      status: "pending",
      requestDate: "2023-06-15",
      expiryDate: "2023-06-22",
      customerName: "김철수",
      price: 4500000,
      isMultiProduct: false,
    },
    {
      id: "Q-2023-002",
      products: [
        {
          productName: "블루투스 이어폰",
          quantity: 200,
        },
      ],
      status: "accepted",
      requestDate: "2023-06-10",
      expiryDate: "2023-06-17",
      customerName: "이영희",
      price: 6000000,
      isMultiProduct: false,
    },
    {
      id: "Q-2023-003",
      products: [
        {
          productName: "보조배터리 10000mAh",
          quantity: 300,
        },
      ],
      status: "rejected",
      requestDate: "2023-06-05",
      expiryDate: "2023-06-12",
      customerName: "박지민",
      price: 3750000,
      isMultiProduct: false,
    },
    {
      id: "Q-2023-004",
      products: [
        {
          productName: "노트북 파우치 15인치",
          quantity: 150,
        },
      ],
      status: "expired",
      requestDate: "2023-05-28",
      expiryDate: "2023-06-04",
      customerName: "최수진",
      price: 2250000,
      isMultiProduct: false,
    },
    {
      id: "Q-2023-005",
      products: [
        {
          productName: "무선 충전기",
          quantity: 400,
        },
      ],
      status: "pending",
      requestDate: "2023-06-14",
      expiryDate: "2023-06-21",
      customerName: "정민수",
      price: 5200000,
      isMultiProduct: false,
    },
    {
      id: "Q-2023-006",
      products: [
        {
          productName: "스마트폰 케이스 (갤럭시 S23)",
          quantity: 300,
        },
        {
          productName: "강화유리 보호필름",
          quantity: 500,
        },
        {
          productName: "휴대폰 그립톡",
          quantity: 200,
        },
      ],
      status: "pending",
      requestDate: "2023-06-18",
      expiryDate: "2023-06-25",
      customerName: "김다중",
      price: 8500000,
      isMultiProduct: true,
    },
    {
      id: "Q-2023-007",
      products: [
        {
          productName: "블루투스 스피커",
          quantity: 100,
        },
        {
          productName: "무선 이어폰",
          quantity: 150,
        },
      ],
      status: "pending",
      requestDate: "2023-06-17",
      expiryDate: "2023-06-24",
      customerName: "이복수",
      price: 7200000,
      isMultiProduct: true,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3" />
            <span>대기 중</span>
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            <span>수락됨</span>
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
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">견적 관리</h1>
            <Button>
              <FileText className="mr-2 h-4 w-4" />새 견적 작성
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="견적 ID, 상품명, 고객명으로 검색..." className="pl-8" />
            </div>
            <Button variant="outline">필터</Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="pending">대기 중</TabsTrigger>
              <TabsTrigger value="accepted">수락됨</TabsTrigger>
              <TabsTrigger value="rejected">거절됨</TabsTrigger>
              <TabsTrigger value="expired">만료됨</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>모든 견적</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            견적 ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상품 정보
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            고객명
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            금액
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상태
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            만료일
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {quotes.map((quote) => (
                          <tr key={quote.id} className={`hover:bg-gray-50 ${quote.isMultiProduct ? "bg-blue-50" : ""}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {quote.id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div>
                                {quote.isMultiProduct ? (
                                  <>
                                    <div className="flex items-center mb-1">
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                                        다중 상품
                                      </Badge>
                                      <p className="font-medium">{quote.products.length}개 상품</p>
                                    </div>
                                    <div className="max-h-20 overflow-y-auto text-xs space-y-1">
                                      {quote.products.map((product, idx) => (
                                        <p key={idx} className="text-gray-600">
                                          • {product.productName} ({product.quantity}개)
                                        </p>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-medium">{quote.products[0].productName}</p>
                                    <p className="text-xs text-gray-500">수량: {quote.products[0].quantity}개</p>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.customerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {quote.price.toLocaleString()}원
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getStatusBadge(quote.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.expiryDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/vendor/quotes/${quote.id}`)}
                                >
                                  상세보기
                                </Button>
                                {quote.status === "pending" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => handleChatOpen(quote.id, quote.customerName)}
                                  >
                                    채팅하기
                                  </Button>
                                )}
                                {quote.status === "accepted" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                  >
                                    주문확인
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 다른 탭 콘텐츠도 유사한 구조로 구현 */}
            <TabsContent value="pending" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>대기 중인 견적</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      {/* 테이블 헤더 및 본문 구조는 위와 동일 */}
                      <thead className="bg-gray-50">
                        {/* 헤더 내용 */}
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            견적 ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상품 정보
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            고객명
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            금액
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            상태
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            만료일
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {quotes
                          .filter((q) => q.status === "pending")
                          .map((quote) => (
                            <tr
                              key={quote.id}
                              className={`hover:bg-gray-50 ${quote.isMultiProduct ? "bg-blue-50" : ""}`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {quote.id}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <div>
                                  {quote.isMultiProduct ? (
                                    <>
                                      <div className="flex items-center mb-1">
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                                          다중 상품
                                        </Badge>
                                        <p className="font-medium">{quote.products.length}개 상품</p>
                                      </div>
                                      <div className="max-h-20 overflow-y-auto text-xs space-y-1">
                                        {quote.products.map((product, idx) => (
                                          <p key={idx} className="text-gray-600">
                                            • {product.productName} ({product.quantity}개)
                                          </p>
                                        ))}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className="font-medium">{quote.products[0].productName}</p>
                                      <p className="text-xs text-gray-500">수량: {quote.products[0].quantity}개</p>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {quote.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {quote.price.toLocaleString()}원
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getStatusBadge(quote.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.expiryDate}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/vendor/quotes/${quote.id}`)}
                                  >
                                    상세보기
                                  </Button>
                                  {quote.status === "pending" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                      onClick={() => handleChatOpen(quote.id, quote.customerName)}
                                    >
                                      채팅하기
                                    </Button>
                                  )}
                                  {quote.status === "accepted" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                      주문확인
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* 채팅 모달 */}
      {selectedCustomer && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          vendorId={selectedCustomer.id}
          vendorName={selectedCustomer.name}
        />
      )}
    </div>
  )
}
