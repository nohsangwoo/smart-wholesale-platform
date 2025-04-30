"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function SearchFormTest() {
  const [hasLocalStorage, setHasLocalStorage] = useState<boolean | null>(null)
  const [testValue, setTestValue] = useState<string | null>(null)

  useEffect(() => {
    // localStorage 사용 가능 여부 테스트
    try {
      localStorage.setItem("test", "test")
      const test = localStorage.getItem("test")
      setHasLocalStorage(test === "test")
      localStorage.removeItem("test")
    } catch (e) {
      setHasLocalStorage(false)
      console.error("localStorage is not available:", e)
    }

    // 최근 검색어 확인
    try {
      const savedSearches = localStorage.getItem("recentSearches")
      setTestValue(savedSearches)
    } catch (e) {
      console.error("Failed to get recent searches:", e)
    }
  }, [])

  const addTestSearch = () => {
    try {
      const testSearch = `https://alibaba.com/product/test-${Date.now()}`
      const savedSearches = localStorage.getItem("recentSearches")
      let searches = []

      if (savedSearches) {
        searches = JSON.parse(savedSearches)
      }

      searches = [testSearch, ...searches].slice(0, 10)
      localStorage.setItem("recentSearches", JSON.stringify(searches))
      setTestValue(JSON.stringify(searches))
      alert("테스트 검색어가 추가되었습니다. 검색창을 클릭해보세요.")
    } catch (e) {
      console.error("Failed to add test search:", e)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white border rounded-lg shadow-lg z-50 text-xs">
      <p>localStorage 사용 가능: {hasLocalStorage === null ? "확인 중..." : hasLocalStorage ? "가능" : "불가능"}</p>
      <p>최근 검색어: {testValue ? testValue : "없음"}</p>
      <Button size="sm" onClick={addTestSearch} className="mt-2">
        테스트 검색어 추가
      </Button>
    </div>
  )
}
