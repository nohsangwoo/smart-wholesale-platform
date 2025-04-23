"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductAnalysis } from "@/components/product-analysis"
import { AnalysisLoading } from "@/components/analysis-loading"
import { analyzeProduct } from "@/lib/api"
import type { ProductData } from "@/lib/types"

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")
  const [isLoading, setIsLoading] = useState(true)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) {
      setError("유효한 URL이 제공되지 않았습니다")
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // 약 2초간 로딩 상태 유지
        setTimeout(async () => {
          const data = await analyzeProduct(url)
          setProductData(data)
          setIsLoading(false)
        }, 2000)
      } catch (err) {
        setError("상품 분석 중 오류가 발생했습니다")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h2>
          <p className="mb-6">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">
            메인 페이지로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      {isLoading ? <AnalysisLoading /> : productData && <ProductAnalysis product={productData} />}
    </main>
  )
}
