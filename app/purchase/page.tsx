"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { getProductById } from "@/lib/api"
import type { ProductData } from "@/lib/types"

export default function PurchasePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const productId = searchParams.get("productId")

  const [product, setProduct] = useState<ProductData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: "",
    zipCode: "",
    requestNote: "",
  })

  useEffect(() => {
    // 인증 확인
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    // 상품 ID 확인
    if (!productId) {
      toast({
        title: "오류",
        description: "상품 정보를 찾을 수 없습니다.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    // 상품 정보 가져오기
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId)
        setProduct(productData)
      } catch (error) {
        toast({
          title: "오류",
          description: "상품 정보를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
        router.push("/")
      }
    }

    fetchProduct()
  }, [productId, isAuthenticated, isLoading, router, toast])

  // 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
        detailAddress: user.detailAddress || "",
        zipCode: user.zipCode || "",
        requestNote: "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 주문 데이터 생성
      const orderData = {
        productId: product?.id,
        productTitle: product?.title,
        totalAmount: product?.estimatedPrice,
        imageUrl: product?.imageUrl,
        shippingInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          detailAddress: formData.detailAddress,
          zipCode: formData.zipCode,
        },
        requestNote: formData.requestNote,
      }

      // 주문 API 호출
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "주문 접수 완료",
          description: "구매 대행 요청이 접수되었습니다.",
        })
        router.push(`/purchase/confirmation?orderId=${data.order.id}`)
      } else {
        throw new Error(data.message || "주문 처리 중 오류가 발생했습니다.")
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "주문 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-foreground">
            뒤로 가기
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">구매 대행 신청</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">구매 대행 신청</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>상품 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">출처: {product.platform}</p>
                  <p className="font-semibold text-primary">{product.estimatedPrice}원</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>배송지 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">수령인 이름</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="zipCode">우편번호</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">주소</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailAddress">상세 주소</Label>
                  <Input
                    id="detailAddress"
                    name="detailAddress"
                    value={formData.detailAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestNote">요청사항</Label>
                  <Textarea
                    id="requestNote"
                    name="requestNote"
                    placeholder="배송 시 요청사항이나 상품에 대한 특별 요청사항을 입력해주세요."
                    value={formData.requestNote}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>결제 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>상품 가격</span>
                    <span>{product.originalPrice}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>수수료</span>
                    <span>{product.fees}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>관세</span>
                    <span>{product.tax}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>{product.shippingCost}원</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>총 결제 금액</span>
                    <span className="text-primary">{product.estimatedPrice}원</span>
                  </div>
                  <p className="text-sm text-muted-foreground">* 관리자 승인 후 결제가 진행됩니다.</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : "구매 대행 신청하기"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
