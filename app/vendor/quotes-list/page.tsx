"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { VendorSidebar } from "@/components/vendor/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Clock, Send } from "lucide-react"
import { ChatModal } from "@/components/chat/chat-modal"
import { useToast } from "@/hooks/use-toast"

// 모의 견적 요청 데이터
const mockQuoteRequests = [
  {
    id: "QR-2023-001",
    customerId: "customer-1",
    customerName: "김철수",
    status: "pending",
    requestDate: "2023-06-15",
    products: [
      {
        id: "product-1",
        title: "스마트폰 케이스 (iPhone 14 Pro)",
        imageUrl: "/bulk-smartphone-cases.png",
        originalPrice: 8000,
        estimatedPrice: 12000,
        platform: "Alibaba",
        originalUrl: "https://www.alibaba.com/product/...",
        additionalNotes: "블랙 색상으로 부탁드립니다.",
      },
    ],
  },
  {
    id: "QR-2023-002",
    customerId: "customer-2",
    customerName: "이영희",
    status: "pending",
    requestDate: "2023-06-14",
    products: [
      {
        id: "product-2",
        title: "블루투스 이어폰",
        imageUrl: "/bulk-bluetooth-earphones.png",
        originalPrice: 25000,
        estimatedPrice: 35000,
        platform: "Taobao",
        originalUrl: "https://www.taobao.com/product/...",
        additionalNotes: "화이트 색상, 노이즈 캔슬링 기능 있는 모델로 부탁드립니다.",
      },
      {
        id: "product-3",
        title: "보조배터리 10000mAh",
        imageUrl: "/portable-power-bank.png",
        originalPrice: 15000,
        estimatedPrice: 22000,
        platform: "Alibaba",
        originalUrl: "https://www.alibaba.com/product/...",
        additionalNotes: "고속 충전 지원되는 모델로 부탁드립니다.",
      },
    ],
  },
  {
    id: "QR-2023-003",
    customerId: "customer-3",
    customerName: "박지민",
    status: "pending",
    requestDate: "2023-06-13",
    products: [
      {
        id: "product-4",
        title: "노트북 파우치 15인치",
        imageUrl: "/laptop-sleeve.png",
        originalPrice: 12000,
        estimatedPrice: 18000,
        platform: "1688",
        originalUrl: "https://www.1688.com/product/...",
      },
    ],
  },
  {
    id: "QR-2023-004",
    customerId: "customer-4",
    customerName: "최수진",
    status: "pending",
    requestDate: "2023-06-12",
    products: [
      {
        id: "product-5",
        title: "무선 충전기",
        imageUrl: "/wireless-charger.png",
        originalPrice: 18000,
        estimatedPrice: 25000,
        platform: "Alibaba",
        originalUrl: "https://www.alibaba.com/product/...",
      },
      {
        id: "product-6",
        title: "스마트워치 밴드",
        imageUrl: "/smartwatch-band-variety.png",
        originalPrice: 5000,
        estimatedPrice: 8000,
        platform: "Taobao",
        originalUrl: "https://www.taobao.com/product/...",
        additionalNotes: "애플워치 7 시리즈 호환 모델, 블랙 색상으로 부탁드립니다.",
      },
      {
        id: "product-7",
        title: "블루투스 스피커",
        imageUrl: "/bluetooth-speaker.png",
        originalPrice: 30000,
        estimatedPrice: 42000,
        platform: "Alibaba",
        originalUrl: "https://www.alibaba.com/product/...",
        additionalNotes: "방수 기능이 있는 모델로 부탁드립니다.",
      },
    ],
  },
]

export default function VendorQuotesListPage() {
  const { isAuthenticated, isLoading } = useVendorAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)
  const [quoteRequests, setQuoteRequests] = useState(mockQuoteRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string }>({ id: "", name: "" })

  // 견적 제출 폼 상태
  const [quoteForm, setQuoteForm] = useState<{
    price: string
    serviceFee: string
    shippingFee: string
    taxFee: string
    otherFees: string
    estimatedDays: string
    description: string
  }>({
    price: "",
    serviceFee: "",
    shippingFee: "",
    taxFee: "",
    otherFees: "",
    estimatedDays: "",
    description: "",
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setQuoteForm({ ...quoteForm, [name]: value })
  }

  const handleSubmitQuote = () => {
    // 필수 필드 검증
    if (
      !quoteForm.price ||
      !quoteForm.serviceFee ||
      !quoteForm.shippingFee ||
      !quoteForm.taxFee ||
      !quoteForm.estimatedDays
    ) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "가격, 수수료, 배송 예상일은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    // 견적 제출 처리 (실제로는 API 호출)
    toast({
      title: "견적이 제출되었습니다",
      description: "고객에게 견적이 전송되었습니다.",
    })

    // 견적 요청 목록에서 제거
    setQuoteRequests(quoteRequests.filter((req) => req.id !== selectedRequest.id))
    setIsDialogOpen(false)

    // 폼 초기화
    setQuoteForm({
      price: "",
      serviceFee: "",
      shippingFee: "",
      taxFee: "",
      otherFees: "",
      estimatedDays: "",
      description: "",
    })
  }

  const openChatModal = (customerId: string, customerName: string) => {
    setSelectedCustomer({ id: customerId, name: customerName })
    setIsChatModalOpen(true)
  }

  // 검색어로 필터링
  const filteredRequests = quoteRequests.filter(
    (req) =>
      req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.products.some((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 총 예상 가격 계산
  const calculateTotalEstimatedPrice = (products: any[]) => {
    return products.reduce((sum, product) => sum + product.estimatedPrice, 0)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">견적 요청 목록</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="고객명, 견적 ID, 상품명으로 검색..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">견적 요청이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          견적 요청 #{request.id}
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>대기 중</span>
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {request.customerName} • {request.requestDate} • 상품 {request.products.length}개
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openChatModal(request.customerId, request.customerName)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          채팅
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsDialogOpen(true)
                          }}
                        >
                          견적 제출
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {request.products.map((product, index) => (
                        <div key={product.id} className="flex gap-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={product.imageUrl || "/placeholder.svg?height=64&width=64&query=product"}
                              alt={product.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/assorted-products-display.png"
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-muted-foreground">출처: {product.platform}</p>
                            <p className="text-sm">예상 가격: {product.estimatedPrice.toLocaleString()}원</p>
                            {product.additionalNotes && (
                              <p className="text-sm mt-1 bg-gray-50 p-2 rounded-md">
                                <span className="font-medium">요청사항:</span> {product.additionalNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex justify-between text-sm font-medium">
                        <span>총 예상 가격</span>
                        <span>{calculateTotalEstimatedPrice(request.products).toLocaleString()}원</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 견적 제출 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>견적 제출</DialogTitle>
            <DialogDescription>{selectedRequest?.customerName}님에게 견적을 제출합니다.</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                {selectedRequest.products.map((product: any, index: number) => (
                  <div key={product.id} className="flex gap-2 py-1">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.imageUrl || "/placeholder.svg?height=40&width=40&query=product"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-muted-foreground">예상: {product.estimatedPrice.toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    상품 가격 (원) *
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={quoteForm.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="serviceFee" className="block text-sm font-medium mb-1">
                      서비스 수수료 (원) *
                    </label>
                    <Input
                      id="serviceFee"
                      name="serviceFee"
                      type="number"
                      value={quoteForm.serviceFee}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="shippingFee" className="block text-sm font-medium mb-1">
                      배송비 (원) *
                    </label>
                    <Input
                      id="shippingFee"
                      name="shippingFee"
                      type="number"
                      value={quoteForm.shippingFee}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="taxFee" className="block text-sm font-medium mb-1">
                      관세 (원) *
                    </label>
                    <Input
                      id="taxFee"
                      name="taxFee"
                      type="number"
                      value={quoteForm.taxFee}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="otherFees" className="block text-sm font-medium mb-1">
                      기타 수수료 (원)
                    </label>
                    <Input
                      id="otherFees"
                      name="otherFees"
                      type="number"
                      value={quoteForm.otherFees}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="estimatedDays" className="block text-sm font-medium mb-1">
                    예상 배송일 (일) *
                  </label>
                  <Input
                    id="estimatedDays"
                    name="estimatedDays"
                    type="number"
                    value={quoteForm.estimatedDays}
                    onChange={handleInputChange}
                    placeholder="7"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    견적 설명
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={quoteForm.description}
                    onChange={handleInputChange}
                    placeholder="견적에 대한 설명이나 추가 정보를 입력하세요."
                    rows={3}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between font-medium">
                  <span>총 견적 금액</span>
                  <span>
                    {(
                      Number(quoteForm.price || 0) +
                      Number(quoteForm.serviceFee || 0) +
                      Number(quoteForm.shippingFee || 0) +
                      Number(quoteForm.taxFee || 0) +
                      Number(quoteForm.otherFees || 0)
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmitQuote}>견적 제출</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId="vendor-1"
        vendorName="판매자"
        customerId={selectedCustomer.id}
        customerName={selectedCustomer.name}
      />
    </div>
  )
}
