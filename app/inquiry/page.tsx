"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Send, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { getProductById } from "@/lib/api"
import type { ProductData } from "@/lib/types"
import { mockOrderDetails } from "@/lib/mock-data"

export default function InquiryPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const productId = searchParams.get("productId")
  const orderId = searchParams.get("orderId")
  const inquiryType = searchParams.get("type") || "general"

  const [product, setProduct] = useState<ProductData | null>(null)
  const [order, setOrder] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const [formData, setFormData] = useState({
    type: inquiryType,
    subject: "",
    content: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "문의하기 기능을 이용하려면 로그인이 필요합니다.",
        variant: "destructive",
      })
      router.push(`/login?redirect=${encodeURIComponent(`/inquiry${window.location.search}`)}`)
      return
    }

    // 사용자 정보로 폼 초기화
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        phone: user.phone || "",
      }))
    }

    // 상품 ID가 있으면 상품 정보 가져오기
    if (productId) {
      const fetchProduct = async () => {
        try {
          const productData = await getProductById(productId)
          setProduct(productData)
          setFormData((prev) => ({
            ...prev,
            subject: `[상품 문의] ${productData.title}`,
          }))
        } catch (error) {
          toast({
            title: "오류",
            description: "상품 정보를 불러오는 중 문제가 발생했습니다.",
            variant: "destructive",
          })
        }
      }
      fetchProduct()
    }

    // 주문 ID가 있으면 주문 정보 가져오기
    if (orderId) {
      // 모킹된 주문 데이터에서 찾기
      const orderData = mockOrderDetails.find((o) => o.id === orderId)
      if (orderData) {
        setOrder(orderData)
        setFormData((prev) => ({
          ...prev,
          subject: `[주문 문의] ${orderData.product.title} (주문번호: ${orderData.id})`,
        }))
      } else {
        toast({
          title: "오류",
          description: "주문 정보를 찾을 수 없습니다.",
          variant: "destructive",
        })
      }
    }
  }, [productId, orderId, inquiryType, isAuthenticated, isLoading, router, toast, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 문의 데이터 생성
      const inquiryData = {
        ...formData,
        productId: product?.id,
        orderId: order?.id,
        userId: user?.id,
        userName: user?.name,
        createdAt: new Date().toISOString(),
        files: files.map((file) => file.name),
      }

      // 문의 API 호출 (모킹)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("문의 데이터:", inquiryData)

      toast({
        title: "문의가 접수되었습니다",
        description: "담당자 확인 후 답변 드리겠습니다.",
      })

      setIsSubmitted(true)
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "문의 접수 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <Send className="h-16 w-16 text-primary mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-4">문의가 접수되었습니다</h1>
          <p className="mb-8 text-muted-foreground">
            담당자 확인 후 입력하신 이메일({formData.email})로 답변 드리겠습니다.
            <br />
            문의해주셔서 감사합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/")}>홈으로 이동</Button>
            <Button variant="outline" onClick={() => router.push("/mypage")}>
              마이페이지로 이동
            </Button>
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
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            뒤로 가기
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">문의하기</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(product || order) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{product ? "상품 정보" : "주문 정보"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={product?.imageUrl || order?.product.imageUrl || "/placeholder.svg"}
                      alt={product?.title || order?.product.title || "상품 이미지"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{product?.title || order?.product.title}</h3>
                    {product && <p className="text-sm text-muted-foreground">출처: {product.platform}</p>}
                    {order && <p className="text-sm text-muted-foreground">주문번호: {order.id}</p>}
                    <p className="font-semibold text-primary">
                      {product?.estimatedPrice.toLocaleString() || order?.totalAmount.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">문의 유형</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="문의 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">일반 문의</SelectItem>
                  <SelectItem value="product">상품 문의</SelectItem>
                  <SelectItem value="order">주문/배송 문의</SelectItem>
                  <SelectItem value="payment">결제 문의</SelectItem>
                  <SelectItem value="return">반품/교환 문의</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">제목</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="문의 제목을 입력해주세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">문의 내용</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="문의하실 내용을 자세히 입력해주세요"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="답변 받으실 이메일 주소"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="연락 가능한 전화번호"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">첨부 파일</Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="file"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                >
                  <Paperclip className="h-4 w-4" />
                  <span>파일 첨부하기</span>
                </Label>
                <Input id="file" type="file" className="hidden" onChange={handleFileChange} multiple />
              </div>
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : "문의 접수하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
