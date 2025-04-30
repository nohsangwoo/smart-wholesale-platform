"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductAnalysis } from "@/components/product-analysis"
import { AnalysisLoading } from "@/components/analysis-loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"
import type { ProductData } from "@/lib/types"

// 모의 상품 데이터 생성
const createMockProductData = (url: string) => {
  const baseProduct = mockProducts[0]
  return {
    id: `product-${Date.now()}`,
    title: baseProduct.title || "프리미엄 스마트폰 케이스 도매 (100개 단위)",
    originalUrl: url,
    platform: url.includes("alibaba") ? "Alibaba" : url.includes("taobao") ? "Taobao" : "1688",
    originalPrice: baseProduct.originalPrice || 450000,
    estimatedPrice: (baseProduct.originalPrice || 450000) * 1.3,
    imageUrl: baseProduct.imageUrl || "/bulk-smartphone-cases.png",
    fees: (baseProduct.originalPrice || 450000) * 0.05,
    tax: (baseProduct.originalPrice || 450000) * 0.08,
    shippingCost: 25000,
    additionalNotes: "",
    specifications: [
      { name: "재질", value: "실리콘, TPU, 하드케이스" },
      { name: "호환 모델", value: "아이폰, 삼성, 샤오미 등" },
      { name: "최소 주문량", value: "100개" },
      { name: "배송 방법", value: "해운 / 항공" },
      { name: "원산지", value: "중국" },
    ],
    seller: {
      name: "Shenzhen Mobile Accessories Co., Ltd.",
      rating: 4.8,
      responseRate: 98,
      responseTime: "12시간 이내",
      transactions: 500,
    },
  }
}

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url")

  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductData[]>([])
  const [newProductUrl, setNewProductUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!url) {
      router.push("/")
      return
    }

    // 상품 분석 시뮬레이션
    const timer = setTimeout(() => {
      // 모의 데이터 생성
      const productData = createMockProductData(url || "https://alibaba.com/product/sample")

      setProducts([productData])
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [url, router])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProductUrl) return

    // URL 유효성 검사
    const isValidUrl =
      newProductUrl.includes("alibaba.com") ||
      newProductUrl.includes("taobao.com") ||
      newProductUrl.includes("1688.com")

    if (!isValidUrl) {
      alert("지원되는 쇼핑몰 링크를 입력해주세요. (Alibaba, Taobao, 1688)")
      return
    }

    setIsAnalyzing(true)

    // 상품 분석 시뮬레이션
    setTimeout(() => {
      // 모의 데이터 생성
      const newProduct = createMockProductData(newProductUrl)

      // 약간의 변형을 주어 다른 상품처럼 보이게 함
      newProduct.title = `${newProduct.title} (${products.length + 1})`
      newProduct.originalPrice = Math.round(newProduct.originalPrice * (0.9 + Math.random() * 0.3))
      newProduct.estimatedPrice = Math.round(newProduct.estimatedPrice * (0.9 + Math.random() * 0.3))

      setProducts([...products, newProduct])
      setNewProductUrl("")
      setIsAnalyzing(false)

      // 최근 검색어에 추가
      try {
        const savedSearches = localStorage.getItem("recentSearches")
        let searches = savedSearches ? JSON.parse(savedSearches) : []
        searches = [newProductUrl, ...searches.filter((s: string) => s !== newProductUrl)].slice(0, 10)
        localStorage.setItem("recentSearches", JSON.stringify(searches))
      } catch (error) {
        console.error("Failed to save recent search:", error)
      }
    }, 1500)
  }

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const handleUpdateNotes = (productId: string, notes: string) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, additionalNotes: notes } : p)))
  }

  if (isLoading) {
    return <AnalysisLoading />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">상품 분석 결과</h1>

        {products.map((product, index) => (
          <div key={product.id} className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">상품 {index + 1}</h2>
              {products.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </Button>
              )}
            </div>
            <ProductAnalysis
              product={product}
              multipleProducts={products.length > 1}
              onUpdateNotes={(notes) => handleUpdateNotes(product.id, notes)}
            />
          </div>
        ))}

        <Card className="mt-8">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">추가 상품 분석</h3>
            <form onSubmit={handleAddProduct} className="flex gap-2">
              <Input
                type="url"
                placeholder="분석할 상품 URL 입력"
                value={newProductUrl}
                onChange={(e) => setNewProductUrl(e.target.value)}
                className="flex-1"
                disabled={isAnalyzing}
              />
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    분석 중...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    추가
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {products.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              size="lg"
              onClick={() => {
                // 세션 스토리지에 상품 정보 저장
                sessionStorage.setItem("purchaseProducts", JSON.stringify(products))
                router.push("/purchase")
              }}
            >
              {products.length > 1 ? `${products.length}개 상품 구매 대행 요청하기` : "구매 대행 요청하기"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
