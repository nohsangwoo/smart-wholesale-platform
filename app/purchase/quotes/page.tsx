"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronRight, Star, CheckCircle, MessageSquare, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { mockVendors, generateMockQuotes, type Vendor, type VendorQuote } from "@/lib/mock-vendors"
import { mockOrderDetails } from "@/lib/mock-data"
import { ChatModal } from "@/components/chat/chat-modal"

export default function QuotesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const orderId = searchParams.get("orderId")

  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const [quotes, setQuotes] = useState<VendorQuote[]>([])
  const [vendors, setVendors] = useState<Record<string, Vendor>>({})
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null)
  const [showQuoteDetail, setShowQuoteDetail] = useState<string | null>(null)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [selectedVendorForChat, setSelectedVendorForChat] = useState<{
    id: string
    name: string
    avatar?: string
  } | null>(null)

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "오류",
        description: "주문 정보를 찾을 수 없습니다.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    const fetchData = async () => {
      try {
        // 디버깅을 위한 로그 추가
        console.log("Fetching data for orderId:", orderId)

        // 주문 정보 가져오기 (모킹)
        const orderData = mockOrderDetails.find((o) => o.id === orderId)
        console.log(
          "Available orders:",
          mockOrderDetails.map((o) => o.id),
        )
        console.log("Found order data:", orderData)

        if (!orderData) {
          // 주문을 찾을 수 없을 때 더 자세한 오류 메시지
          console.error(`Order with ID ${orderId} not found in mockOrderDetails`)

          // 유효한 주문 ID 목록
          const validOrderIds = mockOrderDetails.map((o) => o.id)
          console.log("Valid order IDs:", validOrderIds)

          // 유효한 주문 ID가 있으면 첫 번째 것을 사용
          if (validOrderIds.length > 0) {
            const fallbackOrderId = validOrderIds[0]
            console.log(`Using fallback order ID: ${fallbackOrderId}`)
            const fallbackOrder = mockOrderDetails.find((o) => o.id === fallbackOrderId)

            if (fallbackOrder) {
              setOrder(fallbackOrder)

              // 업체 데이터를 객체로 변환
              const vendorsMap: Record<string, Vendor> = {}
              mockVendors.forEach((vendor) => {
                vendorsMap[vendor.id] = vendor
              })
              setVendors(vendorsMap)

              // 견적 생성
              try {
                const generatedQuotes = generateMockQuotes(fallbackOrderId, fallbackOrder.product.originalPrice)

                // 키키퍼 로지스틱스 업체를 찾아 최상단으로 이동
                const kikeeperIndex = generatedQuotes.findIndex((q) => q.vendorId === "vendor-1")
                if (kikeeperIndex > 0) {
                  const kikeeperQuote = generatedQuotes.splice(kikeeperIndex, 1)[0]
                  generatedQuotes.unshift(kikeeperQuote)
                }

                setQuotes(generatedQuotes)
              } catch (error) {
                console.error("Error generating quotes:", error)
                toast({
                  title: "견적 생성 오류",
                  description: "견적을 생성하는 중 문제가 발생했습니다.",
                  variant: "destructive",
                })
              }

              setIsLoading(false)
              return
            }
          }

          toast({
            title: "주문 정보를 찾을 수 없습니다",
            description: `주문 ID: ${orderId}에 해당하는 주문을 찾을 수 없습니다.`,
            variant: "destructive",
          })
          // 홈으로 리다이렉트하지 않고 대기 페이지로 돌아가기
          router.push(`/purchase/waiting?orderId=${orderId}`)
          return
        }

        setOrder(orderData)

        // 업체 데이터를 객체로 변환 (ID로 빠르게 접근하기 위함)
        const vendorsMap: Record<string, Vendor> = {}
        mockVendors.forEach((vendor) => {
          vendorsMap[vendor.id] = vendor
        })
        setVendors(vendorsMap)

        // 견적 생성
        try {
          const generatedQuotes = generateMockQuotes(orderId, orderData.product.originalPrice)

          // 키키퍼 로지스틱스 업체를 찾아 최상단으로 이동
          const kikeeperIndex = generatedQuotes.findIndex((q) => q.vendorId === "vendor-1")
          if (kikeeperIndex > 0) {
            const kikeeperQuote = generatedQuotes.splice(kikeeperIndex, 1)[0]
            generatedQuotes.unshift(kikeeperQuote)
          }

          setQuotes(generatedQuotes)
        } catch (error) {
          console.error("Error generating quotes:", error)
          toast({
            title: "견적 생성 오류",
            description: "견적을 생성하는 중 문제가 발생했습니다.",
            variant: "destructive",
          })
        }

        // 로딩 완료
        setIsLoading(false)
      } catch (error) {
        console.error("Error in fetchData:", error)
        toast({
          title: "오류 발생",
          description: "데이터를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
        router.push("/")
      }
    }

    fetchData()
  }, [orderId, router, toast])

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuote(quoteId)
  }

  const handleProceed = () => {
    if (!selectedQuote) {
      toast({
        title: "견적을 선택해주세요",
        description: "진행하기 전에 견적을 선택해야 합니다.",
        variant: "destructive",
      })
      return
    }

    // 선택한 견적으로 결제 페이지로 이동
    router.push(`/purchase/payment?orderId=${orderId}&quoteId=${selectedQuote}`)
  }

  const handleOpenChat = (vendorId: string) => {
    const vendor = vendors[vendorId]
    if (vendor) {
      setSelectedVendorForChat({
        id: vendor.id,
        name: vendor.name,
        avatar: vendor.profileImage,
      })
      setChatModalOpen(true)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.push("/")} className="text-sm text-muted-foreground hover:text-foreground">
            홈
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-foreground">
            견적 대기
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">견적 확인</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">전문가 견적 제안</h1>
          <p className="text-sm text-muted-foreground">주문번호: {orderId}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={order?.product?.imageUrl || "/placeholder.svg?height=64&width=64&query=product"}
                  alt={order?.product?.title || "상품 이미지"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if the image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = "/assorted-products-display.png"
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium">{order?.product?.title}</h3>
                <p className="text-sm text-muted-foreground">출처: {order?.product?.platform}</p>
                <p className="text-sm text-muted-foreground">
                  예상 가격: {order?.product?.estimatedPrice?.toLocaleString()}원
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">전문가 견적 ({quotes.length})</h2>
          <div className="space-y-4">
            {quotes.map((quote, index) => {
              const vendor = vendors[quote.vendorId]
              if (!vendor) return null

              const isKikeeper = vendor.id === "vendor-1"
              const totalPrice =
                quote.price +
                quote.additionalFees.serviceFee +
                quote.additionalFees.shippingFee +
                quote.additionalFees.taxFee +
                (quote.additionalFees.otherFees || 0)

              return (
                <Card
                  key={quote.vendorId}
                  className={`overflow-hidden transition-all ${
                    selectedQuote === quote.vendorId ? "ring-2 ring-primary" : ""
                  } ${isKikeeper ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <CardContent className="p-0">
                    <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={vendor.profileImage || "/placeholder.svg?height=48&width=48&query=vendor"}
                            alt={vendor.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if the image fails to load
                              const target = e.target as HTMLImageElement
                              target.src = "/market-stall-produce.png"
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{vendor.name}</h3>
                            {isKikeeper && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                추천
                              </Badge>
                            )}
                            {vendor.verified && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                인증됨
                              </Badge>
                            )}
                            {vendor.premium && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                                프리미엄
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                            <span className="font-medium">{vendor.rating}</span>
                            <span className="text-muted-foreground ml-1">({vendor.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between mt-3 md:mt-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">견적 가격</p>
                            <p className="font-bold text-lg">{totalPrice.toLocaleString()}원</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">배송 예상</p>
                            <p className="font-medium">{quote.estimatedDeliveryDays}일 이내</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setShowQuoteDetail(quote.vendorId)}>
                                <FileText className="h-4 w-4 mr-1" />
                                견적서 보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>{vendor.name} 견적서</DialogTitle>
                                <DialogDescription>견적 상세 정보</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                      src={vendor.profileImage || "/placeholder.svg?height=48&width=48&query=vendor"}
                                      alt={vendor.name}
                                      fill
                                      className="object-cover"
                                      onError={(e) => {
                                        // Fallback to placeholder if the image fails to load
                                        const target = e.target as HTMLImageElement
                                        target.src = "/market-stall-produce.png"
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{vendor.name}</h3>
                                    <div className="flex items-center text-sm">
                                      <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                                      <span>{vendor.rating}</span>
                                      <span className="text-muted-foreground ml-1">({vendor.reviewCount})</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium">견적 설명</h4>
                                  <p className="text-sm">{quote.description}</p>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium">견적 상세</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>상품 가격</span>
                                      <span>{quote.price.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>서비스 수수료</span>
                                      <span>{quote.additionalFees.serviceFee.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>배송비</span>
                                      <span>{quote.additionalFees.shippingFee.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>관세</span>
                                      <span>{quote.additionalFees.taxFee.toLocaleString()}원</span>
                                    </div>
                                    {quote.additionalFees.otherFees && (
                                      <div className="flex justify-between">
                                        <span>기타 수수료</span>
                                        <span>{quote.additionalFees.otherFees.toLocaleString()}원</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-medium pt-2 border-t mt-2">
                                      <span>총 견적 금액</span>
                                      <span>{totalPrice.toLocaleString()}원</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium">업체 정보</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>응답 시간</span>
                                      <span>{vendor.responseTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>성공률</span>
                                      <span>{vendor.successRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>완료 주문</span>
                                      <span>{vendor.completedOrders.toLocaleString()}건</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-1 mt-2">
                                  {vendor.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button onClick={() => handleSelectQuote(quote.vendorId)}>이 견적 선택하기</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={() => handleOpenChat(quote.vendorId)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            채팅하기
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSelectQuote(quote.vendorId)}
                            variant={selectedQuote === quote.vendorId ? "default" : "secondary"}
                          >
                            {selectedQuote === quote.vendorId ? "선택됨" : "선택하기"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-3 text-sm">
                      <div className="flex gap-1">
                        {vendor.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleProceed} disabled={!selectedQuote}>
            선택한 견적으로 진행하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        vendorId={selectedVendorForChat?.id}
        vendorName={selectedVendorForChat?.name}
        vendorAvatar={selectedVendorForChat?.avatar}
      />
    </div>
  )
}
