"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRecent, setShowRecent] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initializedRef = useRef(false)

  // 클라이언트 사이드에서만 localStorage 접근
  useEffect(() => {
    try {
      // 기존 검색어 로드
      const savedSearches = localStorage.getItem("recentSearches")
      let searches: string[] = savedSearches ? JSON.parse(savedSearches) : []

      // 초기 데이터 설정 (한 번만 실행)
      if (!initializedRef.current) {
        initializedRef.current = true

        // Alibaba와 Taobao URL 추가 (중복 방지)
        const defaultSearches = ["https://www.alibaba.com/", "https://www.taobao.com/"]

        let updated = false
        defaultSearches.forEach((url) => {
          if (!searches.includes(url)) {
            searches.unshift(url)
            updated = true
          }
        })

        // 최대 10개로 제한
        searches = searches.slice(0, 10)

        // 변경된 경우에만 localStorage 업데이트
        if (updated) {
          localStorage.setItem("recentSearches", JSON.stringify(searches))
        }
      }

      setRecentSearches(searches)
    } catch (error) {
      console.error("Failed to load recent searches:", error)
    }
  }, [])

  // 최근 검색어 저장
  const saveSearch = (searchUrl: string) => {
    try {
      const updatedSearches = [searchUrl, ...recentSearches.filter((s) => s !== searchUrl)]
      const limitedSearches = updatedSearches.slice(0, 10)
      setRecentSearches(limitedSearches)
      localStorage.setItem("recentSearches", JSON.stringify(limitedSearches))
    } catch (error) {
      console.error("Failed to save recent searches:", error)
    }
  }

  // 검색어 삭제
  const removeSearch = (e: React.MouseEvent, searchUrl: string) => {
    e.stopPropagation()
    try {
      const updatedSearches = recentSearches.filter((s) => s !== searchUrl)
      setRecentSearches(updatedSearches)
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    } catch (error) {
      console.error("Failed to remove search:", error)
    }
  }

  // 검색 실행
  const executeSearch = (searchUrl: string) => {
    if (!searchUrl) return

    setUrl(searchUrl)
    saveSearch(searchUrl)
    setIsLoading(true)
    setShowRecent(false)

    // URL 유효성 검사 (간단한 검증)
    const isValidUrl =
      searchUrl.includes("alibaba.com") || searchUrl.includes("taobao.com") || searchUrl.includes("1688.com")

    if (!isValidUrl) {
      alert("지원되는 쇼핑몰 링크를 입력해주세요. (Alibaba, Taobao, 1688)")
      setIsLoading(false)
      return
    }

    // 인코딩된 URL을 쿼리 파라미터로 전달
    const encodedUrl = encodeURIComponent(searchUrl)

    // 분석 페이지로 이동 (실제로는 API 호출 후 이동)
    setTimeout(() => {
      router.push(`/analysis?url=${encodedUrl}`)
    }, 500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(url)
  }

  const handleFocus = () => {
    console.log("Input focused, showing recent searches")
    setShowRecent(true)
  }

  // 검색창 외부 클릭 시 최근 검색어 목록 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecent(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full max-w-3xl mx-auto flex-col gap-2" ref={searchRef}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="url"
            placeholder="해외 쇼핑몰 상품 링크를 입력하세요 (예: https://alibaba.com/product/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={handleFocus}
            onClick={handleFocus}
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

          {/* 최근 검색어 목록 */}
          {showRecent && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">최근 검색</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.preventDefault()
                    try {
                      localStorage.removeItem("recentSearches")
                      setRecentSearches([])
                    } catch (error) {
                      console.error("Failed to clear recent searches:", error)
                    }
                  }}
                >
                  전체 삭제
                </Button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => executeSearch(search)}
                  >
                    <span className="text-sm truncate flex-1">{search}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2 flex-shrink-0"
                      onClick={(e) => removeSearch(e, search)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">삭제</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          링크를 붙여넣으면 AI가 자동으로 상품을 분석하고 예상 가격을 계산해 드립니다
        </p>
      </div>
    </form>
  )
}
