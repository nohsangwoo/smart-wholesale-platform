"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { LoginModal } from "@/components/auth/login-modal"
import { mockProducts } from "@/lib/mock-data"
import type { ProductData } from "@/lib/types"

export default function PurchasePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [products, setProducts] = useState<ProductData[]>([])
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: "",
    zipCode: "",
    message: "",
  })
  const [totalPrice, setTotalPrice] = useState(0)

  // 상품 ID로 모의 상품 데이터 생성 함수 추가
  const createMockProductData = useCallback((productId: string): ProductData => {
    // mockProducts에서 첫 번째 항목을 기본 템플릿으로 사용
    const baseProduct = mockProducts[0] || {
      id: productId,
      title: "샘플 상품",
      originalPrice: 100000,
      imageUrl: "/assorted-products-display.png",
    }

    // 완전한 ProductData 객체 생성
    return {
      id: productId,
      title: baseProduct.title,
      platform: "Alibaba",
      originalPrice: baseProduct.originalPrice,
      estimatedPrice: Math.round(baseProduct.originalPrice * 1.3),
      imageUrl: baseProduct.imageUrl,
      fees: Math.round(baseProduct.originalPrice * 0.05),
      tax: Math.round(baseProduct.originalPrice * 0.08),
      shippingCost: Math.round(baseProduct.originalPrice * 0.05),
      originalUrl: `https://alibaba.com/product/${productId}`,
      additionalNotes: "",
    }
  }, [])

  // 초기 상품 데이터 로드
  useEffect(() => {
    // 세션 스토리지에서 상품 정보 가져오기
    const storedProducts = sessionStorage.getItem("purchaseProducts")

    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts)
        setProducts(parsedProducts)
      } catch (error) {
        console.error("Failed to parse stored products:", error)
        handleInitialProduct()
      }
    } else {
      handleInitialProduct()
    }
  }, []) // 컴포넌트 마운트 시 한 번만 실행

  // URL 파라미터로 전달된 단일 상품 ID 처리
  const handleInitialProduct = useCallback(() => {
    const productId = searchParams.get("productId")

    if (productId) {
      // 모의 데이터 사용
      setProducts([createMockProductData(productId)])
    } else {
      toast({
        title: "상품 정보가 없습니다",
        description: "상품 분석 페이지로 이동합니다.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [searchParams, router, toast, createMockProductData])

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || prevData.name,
        phone: user.phone || prevData.phone,
        email: user.email || prevData.email,
        address: user.address || prevData.address,
        detailAddress: user.detailAddress || prevData.detailAddress,
        zipCode: user.zipCode || prevData.zipCode,
      }))
    }
  }, [user])

  // 총 예상 가격 계산
  useEffect(() => {
    const sum = products.reduce((acc, product) => acc + product.estimatedPrice, 0)
    setTotalPrice(sum)
  }, [products])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductNotesChange = (productId: string, notes: string) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === productId ? { ...p, additionalNotes: notes } : p)))
  }

  const handleRemoveProduct = (productId: string) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter((p) => p.id !== productId)

      // 세션 스토리지 업데이트
      if (updatedProducts.length > 0) {
        sessionStorage.setItem("purchaseProducts", JSON.stringify(updatedProducts))
      } else {
        sessionStorage.removeItem("purchaseProducts")
        // 상품이 없으면 홈으로 리다이렉트
        setTimeout(() => router.push("/"), 0)
      }

      return updatedProducts
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }

    // 필수 입력 필드 검증
    const requiredFields = ["name", "phone", "email", "address", "zipCode"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "배송 정보를 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 모의 API 호출
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
          shippingInfo: formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // 세션 스토리지 정리
        sessionStorage.removeItem("purchaseProducts")

        // 주문 확인 페이지로 이동
        router.push(`/purchase/confirmation?orderId=${data.orderId}`)
      } else {
        throw new Error(data.message || "주문 처리 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("Order submission error:", error)
      toast({
        title: "주문 처리 중 오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.push("/")} className="text-sm text-muted-foreground hover:text-foreground">
            홈
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">구매 대행 신청</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">구매 대행 신청</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* 상품 정보 섹션 */}
            <section>
              <h2 className="text-lg font-semibold mb-4">상품 정보 ({products.length}개)</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={product.imageUrl || "/placeholder.svg?height=80&width=80&query=product"}
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
                          <div className="flex justify-between">
                            <h3 className="font-medium">{product.title}</h3>
                            {products.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveProduct(product.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">삭제</span>
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">출처: {product.platform}</p>
                          <p className="text-sm font-medium mt-1">
                            예상 가격: {product.estimatedPrice.toLocaleString()}원
                          </p>

                          <div className="mt-3">
                            <label htmlFor={`notes-${product.id}`} className="block text-sm font-medium mb-1">
                              추가 요청사항 (선택)
                            </label>
                            <Textarea
                              id={`notes-${product.id}`}
                              placeholder="색상, 사이즈, 옵션 등 추가 요청사항을 입력해주세요."
                              value={product.additionalNotes || ""}
                              onChange={(e) => handleProductNotesChange(product.id, e.target.value)}
                              className="resize-none"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between font-medium">
                  <span>총 예상 가격</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">* 실제 가격은 전문가 견적 후 확정됩니다.</p>
              </div>
            </section>

            {/* 배송 정보 섹션 */}
            <section>
              <h2 className="text-lg font-semibold mb-4">배송 정보</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        이름 *
                      </label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        연락처 *
                      </label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      이메일 *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                        우편번호 *
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="flex-1"
                        />
                        <Button type="button" variant="outline">
                          주소 찾기
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      주소 *
                    </label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                  </div>

                  <div>
                    <label htmlFor="detailAddress" className="block text-sm font-medium mb-1">
                      상세 주소
                    </label>
                    <Input
                      id="detailAddress"
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      배송 메시지 (선택)
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="배송 시 요청사항을 입력해주세요."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="text-center">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : `${products.length}개 상품 구매 대행 신청하기`}
              </Button>
            </div>
          </div>
        </form>

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} redirectUrl="/purchase" />
      </div>
    </div>
  )
}
