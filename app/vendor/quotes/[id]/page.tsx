"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  MessageSquare,
  Send,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChatModal } from "@/components/chat/chat-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const { user } = useVendorAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // 견적 요청 상세 정보 (실제로는 API에서 가져와야 함)
  const quoteRequest = {
    id: params.id,
    customerName: "홍길동",
    customerEmail: "hong@example.com",
    requestDate: "2023-04-20",
    deadline: "2023-04-25",
    status: "new",
    isMultiProduct: params.id === "Q-2023-006" || params.id === "Q-2023-007",
    products:
      params.id === "Q-2023-006"
        ? [
            {
              productName: "스마트폰 케이스 (갤럭시 S23)",
              quantity: 300,
              details: `
              - 제품: 갤럭시 S23 케이스
              - 수량: 300개
              - 색상: 블랙, 화이트, 네이비 (각 색상별 약 100개씩)
              - 재질: 실리콘 또는 TPU
              - 로고 인쇄 필요
              - 개별 포장 필요
            `,
              attachments: [
                { name: "케이스 디자인.pdf", url: "#" },
                { name: "로고 파일.png", url: "#" },
              ],
            },
            {
              productName: "강화유리 보호필름",
              quantity: 500,
              details: `
              - 제품: 갤럭시 S23용 강화유리 보호필름
              - 수량: 500개
              - 두께: 0.3mm
              - 9H 경도
              - 지문 방지 코팅
              - 개별 포장 필요
            `,
              attachments: [{ name: "보호필름 규격.pdf", url: "#" }],
            },
            {
              productName: "휴대폰 그립톡",
              quantity: 200,
              details: `
              - 제품: 스마트폰 그립톡
              - 수량: 200개
              - 디자인: 심플한 단색 디자인
              - 색상: 블랙, 화이트, 골드 (각 색상별 약 70개씩)
              - 로고 인쇄 필요
            `,
              attachments: [{ name: "그립톡 디자인.pdf", url: "#" }],
            },
          ]
        : params.id === "Q-2023-007"
          ? [
              {
                productName: "블루투스 스피커",
                quantity: 100,
                details: `
                - 제품: 휴대용 블루투스 스피커
                - 수량: 100개
                - 배터리: 최소 8시간 재생
                - 방수 기능 필요 (IPX5 이상)
                - 브랜드 로고 인쇄
              `,
                attachments: [{ name: "스피커 사양서.pdf", url: "#" }],
              },
              {
                productName: "무선 이어폰",
                quantity: 150,
                details: `
                - 제품: TWS 무선 이어폰
                - 수량: 150개
                - 배터리: 이어폰 4시간, 케이스 포함 20시간
                - 블루투스 5.0 이상
                - 노이즈 캔슬링 기능 선호
              `,
                attachments: [{ name: "이어폰 사양서.pdf", url: "#" }],
              },
            ]
          : [
              {
                productName:
                  params.id === "Q-2023-001"
                    ? "스마트폰 케이스 (iPhone 14 Pro)"
                    : params.id === "Q-2023-002"
                      ? "블루투스 이어폰"
                      : params.id === "Q-2023-003"
                        ? "보조배터리 10000mAh"
                        : params.id === "Q-2023-004"
                          ? "노트북 파우치 15인치"
                          : "무선 충전기",
                quantity:
                  params.id === "Q-2023-001"
                    ? 500
                    : params.id === "Q-2023-002"
                      ? 200
                      : params.id === "Q-2023-003"
                        ? 300
                        : params.id === "Q-2023-004"
                          ? 150
                          : 400,
                details: `
                - 제품: ${
                  params.id === "Q-2023-001"
                    ? "아이폰 14 Pro 케이스"
                    : params.id === "Q-2023-002"
                      ? "블루투스 이어폰"
                      : params.id === "Q-2023-003"
                        ? "보조배터리 10000mAh"
                        : params.id === "Q-2023-004"
                          ? "노트북 파우치 15인치"
                          : "무선 충전기"
                }
                - 수량: ${
                  params.id === "Q-2023-001"
                    ? "500개"
                    : params.id === "Q-2023-002"
                      ? "200개"
                      : params.id === "Q-2023-003"
                        ? "300개"
                        : params.id === "Q-2023-004"
                          ? "150개"
                          : "400개"
                }
                ${
                  params.id === "Q-2023-001"
                    ? "- 색상: 블랙, 화이트, 네이비 (각 색상별 약 170개씩)\n- 재질: 실리콘 또는 TPU\n- 로고 인쇄 필요\n- 개별 포장 필요"
                    : params.id === "Q-2023-002"
                      ? "- 블루투스 5.0 이상\n- 배터리 지속시간: 최소 5시간\n- 노이즈 캔슬링 기능 선호\n- 방수 기능 선호"
                      : params.id === "Q-2023-003"
                        ? "- 용량: 10000mAh\n- 입출력: USB-C, USB-A\n- 고속 충전 지원\n- 로고 인쇄 필요"
                        : params.id === "Q-2023-004"
                          ? "- 사이즈: 15인치 노트북 수납\n- 방수 기능 필요\n- 외부 포켓 2개 이상\n- 로고 인쇄 필요"
                          : "- 입력: USB-C\n- 출력: 15W 이상\n- 다중 코일 설계\n- 로고 인쇄 필요"
                }
              `,
                attachments: [
                  { name: "제품 디자인.pdf", url: "#" },
                  { name: "로고 파일.png", url: "#" },
                ],
              },
            ],
    customerId: "customer123", // 가상의 고객 ID
  }

  // 각 상품별 견적 입력 폼 상태 관리
  const [formData, setFormData] = useState(() => {
    // 상품 수에 따라 초기 폼 데이터 생성
    const initialData = quoteRequest.products.map(() => ({
      price: "",
      deliveryDays: "",
      description: "",
      additionalNotes: "",
    }))

    // 전체 견적 요약 정보 추가
    return {
      products: initialData,
      summary: {
        totalPrice: "",
        averageDeliveryDays: "",
        overallDescription: "",
        additionalNotes: "",
      },
    }
  })

  // 상품 확장/축소 토글
  const toggleProductExpand = (index: number) => {
    setExpandedProducts((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  // 폼 입력 처리
  const handleProductInputChange = (
    productIndex: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updatedProducts = [...prev.products]
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        [name]: value,
      }
      return {
        ...prev,
        products: updatedProducts,
      }
    })
  }

  // 요약 정보 입력 처리
  const handleSummaryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      summary: {
        ...prev.summary,
        [name]: value,
      },
    }))
  }

  // 자동 계산 - 총 가격 및 평균 배송일
  useEffect(() => {
    if (quoteRequest.isMultiProduct) {
      // 모든 상품 가격이 입력된 경우에만 총 가격 계산
      const allPricesEntered = formData.products.every((p) => p.price !== "")
      if (allPricesEntered) {
        const totalPrice = formData.products.reduce((sum, product) => {
          return sum + (Number.parseInt(product.price) || 0)
        }, 0)

        // 모든 배송일이 입력된 경우에만 평균 배송일 계산
        const allDeliveryDaysEntered = formData.products.every((p) => p.deliveryDays !== "")
        if (allDeliveryDaysEntered) {
          const totalDays = formData.products.reduce((sum, product) => {
            return sum + (Number.parseInt(product.deliveryDays) || 0)
          }, 0)
          const avgDays = Math.ceil(totalDays / formData.products.length)

          setFormData((prev) => ({
            ...prev,
            summary: {
              ...prev.summary,
              totalPrice: totalPrice.toString(),
              averageDeliveryDays: avgDays.toString(),
            },
          }))
        }
      }
    }
  }, [formData.products, quoteRequest.isMultiProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // 실제로는 API 호출로 견적 제출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 성공 시 견적 목록 페이지로 이동
      router.push("/vendor/quotes")
    } catch (err) {
      setError("견적 제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/vendor/quotes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">견적 상세 - {params.id}</h1>
        <Badge>{quoteRequest.status === "new" ? "신규" : "처리 중"}</Badge>
        {quoteRequest.isMultiProduct && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            다중 상품 ({quoteRequest.products.length}개)
          </Badge>
        )}
      </div>

      {!quoteRequest.isMultiProduct ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* 카드 내용은 그대로 유지 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>견적 요청 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">고객명</p>
                  <p>{quoteRequest.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">이메일</p>
                  <p>{quoteRequest.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">요청일</p>
                  <p>{quoteRequest.requestDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">마감일</p>
                  <p className="font-medium text-red-500">{quoteRequest.deadline}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">상품명</p>
                <p className="font-medium">{quoteRequest.products[0].productName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">상세 요구사항</p>
                <pre className="mt-1 whitespace-pre-wrap rounded bg-muted p-2 text-sm">
                  {quoteRequest.products[0].details}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">첨부 파일</p>
                <div className="mt-1 space-y-2">
                  {quoteRequest.products[0].attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <a href={file.url} className="text-sm text-blue-600 hover:underline">
                        {file.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" onClick={() => setIsChatModalOpen(true)}>
                <MessageSquare className="h-4 w-4" />
                고객과 채팅하기
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>견적 작성</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">견적 금액 (원)</Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="예: 2500000"
                    value={formData.products[0].price}
                    onChange={(e) => handleProductInputChange(0, e)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDays">예상 배송 기간 (일)</Label>
                  <Input
                    id="deliveryDays"
                    name="deliveryDays"
                    placeholder="예: 7"
                    value={formData.products[0].deliveryDays}
                    onChange={(e) => handleProductInputChange(0, e)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">견적 설명</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="견적에 대한 상세 설명을 입력하세요."
                    rows={4}
                    value={formData.products[0].description}
                    onChange={(e) => handleProductInputChange(0, e)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">추가 참고사항</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    placeholder="추가 참고사항이 있다면 입력하세요."
                    rows={2}
                    value={formData.products[0].additionalNotes}
                    onChange={(e) => handleProductInputChange(0, e)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/vendor/quotes")}>
                취소
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                <Send className="h-4 w-4" />
                {isSubmitting ? "제출 중..." : "견적 제출하기"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="overview">견적 개요</TabsTrigger>
            <TabsTrigger value="products">상품별 견적</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              {/* 다중 상품 견적 개요 내용 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>견적 요청 정보</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">고객명</p>
                      <p>{quoteRequest.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">이메일</p>
                      <p>{quoteRequest.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">요청일</p>
                      <p>{quoteRequest.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">마감일</p>
                      <p className="font-medium text-red-500">{quoteRequest.deadline}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      <p className="font-medium">요청 상품 목록 ({quoteRequest.products.length}개)</p>
                    </div>
                    <div className="space-y-2">
                      {quoteRequest.products.map((product, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleProductExpand(index)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <p className="font-medium">{product.productName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-gray-100">
                                {product.quantity}개
                              </Badge>
                              {expandedProducts.includes(index) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {expandedProducts.includes(index) && (
                            <div className="mt-3 pt-3 border-t text-sm">
                              <p className="text-sm font-medium text-muted-foreground mb-1">상세 요구사항</p>
                              <pre className="whitespace-pre-wrap rounded bg-muted p-2 text-xs">{product.details}</pre>

                              {product.attachments.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-muted-foreground mb-1">첨부 파일</p>
                                  <div className="space-y-1">
                                    {product.attachments.map((file, fileIdx) => (
                                      <div key={fileIdx} className="flex items-center gap-2">
                                        <FileText className="h-3 w-3" />
                                        <a href={file.url} className="text-xs text-blue-600 hover:underline">
                                          {file.name}
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-2" onClick={() => setIsChatModalOpen(true)}>
                    <MessageSquare className="h-4 w-4" />
                    고객과 채팅하기
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>견적 요약</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalPrice">총 견적 금액 (원)</Label>
                      <Input
                        id="totalPrice"
                        name="totalPrice"
                        placeholder="자동 계산됩니다"
                        value={formData.summary.totalPrice}
                        onChange={handleSummaryInputChange}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">* 각 상품별 견적 금액의 합계입니다</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="averageDeliveryDays">평균 배송 기간 (일)</Label>
                      <Input
                        id="averageDeliveryDays"
                        name="averageDeliveryDays"
                        placeholder="자동 계산됩니다"
                        value={formData.summary.averageDeliveryDays}
                        onChange={handleSummaryInputChange}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">* 각 상품별 배송 기간의 평균입니다</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overallDescription">종합 견적 설명</Label>
                      <Textarea
                        id="overallDescription"
                        name="overallDescription"
                        placeholder="전체 견적에 대한 설명을 입력하세요."
                        rows={4}
                        value={formData.summary.overallDescription}
                        onChange={handleSummaryInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">추가 참고사항</Label>
                      <Textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        placeholder="추가 참고사항이 있다면 입력하세요."
                        rows={2}
                        value={formData.summary.additionalNotes}
                        onChange={handleSummaryInputChange}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/vendor/quotes")}>
                    취소
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "제출 중..." : "견적 제출하기"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="products">
            <div className="space-y-6">
              {quoteRequest.products.map((product, index) => (
                <Card key={index} className={index === 0 ? "border-blue-300" : ""}>
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        <span>
                          상품 {index + 1}: {product.productName}
                        </span>
                      </div>
                      <Badge variant="outline">수량: {product.quantity}개</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">상세 요구사항</p>
                        <pre className="whitespace-pre-wrap rounded bg-muted p-2 text-sm">{product.details}</pre>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">첨부 파일</p>
                        <div className="space-y-2">
                          {product.attachments.map((file, fileIdx) => (
                            <div key={fileIdx} className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <a href={file.url} className="text-sm text-blue-600 hover:underline">
                                {file.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">견적 정보 입력</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`price-${index}`}>견적 금액 (원)</Label>
                          <Input
                            id={`price-${index}`}
                            name="price"
                            placeholder="예: 2500000"
                            value={formData.products[index].price}
                            onChange={(e) => handleProductInputChange(index, e)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`deliveryDays-${index}`}>예상 배송 기간 (일)</Label>
                          <Input
                            id={`deliveryDays-${index}`}
                            name="deliveryDays"
                            placeholder="예: 7"
                            value={formData.products[index].deliveryDays}
                            onChange={(e) => handleProductInputChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`description-${index}`}>견적 설명</Label>
                        <Textarea
                          id={`description-${index}`}
                          name="description"
                          placeholder="견적에 대한 상세 설명을 입력하세요."
                          rows={3}
                          value={formData.products[index].description}
                          onChange={(e) => handleProductInputChange(index, e)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`additionalNotes-${index}`}>추가 참고사항</Label>
                        <Textarea
                          id={`additionalNotes-${index}`}
                          name="additionalNotes"
                          placeholder="추가 참고사항이 있다면 입력하세요."
                          rows={2}
                          value={formData.products[index].additionalNotes}
                          onChange={(e) => handleProductInputChange(index, e)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={quoteRequest.customerId}
        vendorName={quoteRequest.customerName}
        vendorAvatar={undefined} // 실제 구현에서는 고객 아바타 정보를 추가해야 합니다
      />
    </div>
  )
}
