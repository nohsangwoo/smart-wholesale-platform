"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ChevronRight, Loader2, Calendar, Clock, Crown, Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ChatModal } from "@/components/chat/chat-modal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// 견적 제안 목록 정렬 함수
const sortVendorQuotes = (quotes) => {
  // 키키퍼 로지스틱스가 있는지 확인
  const kikiperIndex = quotes.findIndex((q) => q.vendorName === "키키퍼 로지스틱스")

  // 정렬된 배열 생성
  let sortedQuotes = [...quotes]

  // 키키퍼 로지스틱스가 있으면 맨 앞으로 이동
  if (kikiperIndex !== -1) {
    const kikiper = sortedQuotes.splice(kikiperIndex, 1)[0]
    sortedQuotes = [kikiper, ...sortedQuotes]
  }

  // 나머지는 프리미엄 여부에 따라 정렬
  sortedQuotes = [
    ...sortedQuotes.filter((q) => q.vendorName === "키키퍼 로지스틱스"),
    ...sortedQuotes.filter((q) => q.isPremium && q.vendorName !== "키키퍼 로지스틱스"),
    ...sortedQuotes.filter((q) => !q.isPremium && q.vendorName !== "키키퍼 로지스틱스"),
  ]

  return sortedQuotes
}

// 모의 데이터: 견적 요청 및 제안
const mockQuoteData = {
  id: "q7",
  productName: "디자인 티셔츠 (1000개)",
  requestDate: "2023-05-10",
  status: "견적완료",
  description: "회사 로고가 인쇄된 고품질 면 티셔츠 대량 구매",
  budget: "15,000,000원",
  deadline: "2023-06-01",
  isMultiProduct: false,
  products: [
    {
      id: "p7",
      name: "디자인 티셔츠 (1000개)",
      description: "회사 로고가 인쇄된 고품질 면 티셔츠",
      imageUrl: "/diverse-casual-tees.png",
      additionalRequest: "다양한 사이즈(S-XXL), 로고 인쇄, 개별 포장 필요",
    },
  ],
  quotes: [
    {
      id: "v7",
      vendorName: "키키퍼 로지스틱스",
      vendorId: "vendor7",
      vendorAvatar: "/abstract-korean-logo.png",
      price: "14,800,000원",
      deliveryDate: "2023-05-20",
      rating: 4.9,
      message: "최고급 원단 사용, 빠른 배송과 품질 보증. 추가 요청사항 모두 반영 가능.",
      isPremium: true,
    },
    {
      id: "v6",
      vendorName: "패션 프로",
      vendorId: "vendor6",
      vendorAvatar: "/elegant-fashion-logo.png",
      price: "14,500,000원",
      deliveryDate: "2023-05-25",
      rating: 4.7,
      message: "프리미엄 면 소재 사용, 고품질 로고 인쇄 및 개별 포장 서비스 제공.",
      isPremium: true,
    },
    {
      id: "v10",
      vendorName: "프리미엄 텍스타일",
      vendorId: "vendor10",
      vendorAvatar: "/abstract-red-logo.png",
      price: "14,600,000원",
      deliveryDate: "2023-05-26",
      rating: 4.8,
      message: "최고급 면 소재와 프리미엄 인쇄 기술로 완벽한 품질 보장.",
      isPremium: true,
    },
    {
      id: "v8",
      vendorName: "의류 마스터",
      vendorId: "vendor8",
      vendorAvatar: "/abstract-blue-logo.png",
      price: "14,200,000원",
      deliveryDate: "2023-05-28",
      rating: 4.5,
      message: "대량 주문 특별 할인 적용. 다양한 사이즈와 개별 포장 모두 가능합니다.",
      isPremium: false,
    },
    {
      id: "v9",
      vendorName: "글로벌 어패럴",
      vendorId: "vendor9",
      vendorAvatar: "/abstract-green-logo.png",
      price: "14,000,000원",
      deliveryDate: "2023-06-01",
      rating: 4.4,
      message: "합리적인 가격에 품질 보장. 추가 주문 시 할인 혜택 제공.",
      isPremium: false,
    },
  ],
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const orderId = searchParams.get("orderId") || mockQuoteData.id

  const [isLoading, setIsLoading] = useState(true)
  const [quoteData, setQuoteData] = useState(mockQuoteData)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<any>(null)

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [orderId])

  const handleOpenChat = (vendor: any) => {
    setSelectedVendor(vendor)
    setIsChatModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">주문 정보를 확인 중입니다...</h2>
          <p className="text-muted-foreground">잠시만 기다려주세요.</p>
        </div>
      </div>
    )
  }

  const sortedQuotes = sortVendorQuotes(quoteData.quotes)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.push("/")} className="text-sm text-muted-foreground hover:text-foreground">
            홈
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">주문 확인</span>
        </div>

        {/* 주문 접수 완료 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">주문 접수 완료!</h1>
            <p className="text-muted-foreground">
              구매 대행 요청이 성공적으로 접수되었습니다. 아래 견적 제안을 확인해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>주문 번호</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>주문 상태</span>
                    <span className="font-medium text-green-600">견적 제안 확인 가능</span>
                  </div>
                  <div className="flex justify-between">
                    <span>주문 일시</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">상품 정보</h2>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={quoteData.products[0].imageUrl || "/placeholder.svg"}
                      alt={quoteData.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{quoteData.productName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{quoteData.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        요청일: {quoteData.requestDate}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        마감일: {quoteData.deadline}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 mt-2">
                      예산: {quoteData.budget}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 견적 제안 목록 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">견적 제안 목록</h2>
            <Badge className="bg-green-100 text-green-800">{quoteData.quotes.length}개의 견적 제안</Badge>
          </div>

          <div className="space-y-6">
            {sortedQuotes.map((vendor) => (
              <Card
                key={vendor.id}
                className={`overflow-hidden ${
                  vendor.vendorName === "키키퍼 로지스틱스"
                    ? "border-blue-300 bg-blue-50/20"
                    : vendor.isPremium
                      ? "border-amber-200 bg-amber-50/20"
                      : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        <img
                          src={vendor.vendorAvatar || "/placeholder.svg"}
                          alt={vendor.vendorName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{vendor.vendorName}</CardTitle>
                          {vendor.isPremium && vendor.vendorName !== "키키퍼 로지스틱스" && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                              <Crown className="h-3 w-3 mr-1" />
                              프리미엄
                            </Badge>
                          )}
                          {vendor.vendorName === "키키퍼 로지스틱스" && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              <Star className="h-3 w-3 mr-1" />
                              추천
                            </Badge>
                          )}
                        </div>
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
                    <Badge className="bg-green-100 text-green-800 text-lg">{vendor.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{vendor.message}</p>

                  {quoteData.isMultiProduct && vendor.productPrices && (
                    <div className="mt-3 mb-2">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="product-prices">
                          <AccordionTrigger className="text-sm font-medium py-2">상품별 견적 가격</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 mt-1">
                              {vendor.productPrices.map((productPrice: any) => {
                                const product = quoteData.products.find((p) => p.id === productPrice.productId)
                                return (
                                  <div
                                    key={productPrice.productId}
                                    className="flex justify-between items-center p-2 rounded-md bg-background"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                          src={product?.imageUrl || "/placeholder.svg"}
                                          alt={product?.name || "상품 이미지"}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <span className="text-sm">{product?.name || "상품"}</span>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-800">
                                      {productPrice.price}
                                    </Badge>
                                  </div>
                                )
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="bg-blue-50">
                      배송 예정일: {vendor.deliveryDate}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOpenChat(vendor)}>
                    <MessageSquare className="h-4 w-4" />
                    채팅하기
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => router.push(`/purchase/payment?orderId=${quoteData.id}&quoteId=${vendor.id}`)}
                  >
                    견적 선택하기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* 하단 버튼 섹션 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/mypage/quotes")} variant="outline" className="w-full sm:w-auto">
            내 견적 요청 목록 보기
          </Button>
          <Button onClick={() => router.push("/")} variant="default" className="w-full sm:w-auto">
            홈으로 돌아가기
          </Button>
        </div>
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
