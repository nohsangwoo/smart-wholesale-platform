"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsLoading(true)

    // URL 유효성 검사 (간단한 검증)
    const isValidUrl = url.includes("alibaba.com") || url.includes("taobao.com") || url.includes("1688.com")

    if (!isValidUrl) {
      alert("지원되는 쇼핑몰 링크를 입력해주세요. (Alibaba, Taobao, 1688)")
      setIsLoading(false)
      return
    }

    // 인코딩된 URL을 쿼리 파라미터로 전달
    const encodedUrl = encodeURIComponent(url)

    // 분석 페이지로 이동 (실제로는 API 호출 후 이동)
    setTimeout(() => {
      router.push(`/analysis?url=${encodedUrl}`)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full max-w-3xl mx-auto flex-col gap-2">
        <div className="relative">
          <Input
            type="url"
            placeholder="해외 쇼핑몰 상품 링크를 입력하세요 (예: https://alibaba.com/product/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pr-12 py-6 text-base rounded-full border-2 shadow-sm"
            required
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-10 w-10"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">검색</span>
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          링크를 붙여넣으면 AI가 자동으로 상품을 분석하고 예상 가격을 계산해 드립니다
        </p>
      </div>
    </form>
  )
}
