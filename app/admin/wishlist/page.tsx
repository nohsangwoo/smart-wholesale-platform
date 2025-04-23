"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowUpDown } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"

// 모킹된 찜 목록 데이터
const mockWishlistStats = mockProducts.map((product) => ({
  productId: product.id,
  productTitle: product.title,
  wishlistCount: Math.floor(Math.random() * 50) + 1,
  conversionRate: Math.random() * 0.2,
  averageTimeToConversion: Math.floor(Math.random() * 10) + 1,
}))

export default function AdminWishlistPage() {
  const [wishlistStats, setWishlistStats] = useState(mockWishlistStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({
    key: "wishlistCount",
    direction: "descending",
  })

  const filteredStats = wishlistStats
    .filter((stat) => stat.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortConfig.key === "wishlistCount") {
        return sortConfig.direction === "ascending"
          ? a.wishlistCount - b.wishlistCount
          : b.wishlistCount - a.wishlistCount
      } else if (sortConfig.key === "conversionRate") {
        return sortConfig.direction === "ascending"
          ? a.conversionRate - b.conversionRate
          : b.conversionRate - a.conversionRate
      } else if (sortConfig.key === "averageTimeToConversion") {
        return sortConfig.direction === "ascending"
          ? a.averageTimeToConversion - b.averageTimeToConversion
          : b.averageTimeToConversion - a.averageTimeToConversion
      }
      return 0
    })

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  // 총 찜 수 계산
  const totalWishlists = wishlistStats.reduce((sum, stat) => sum + stat.wishlistCount, 0)

  // 평균 전환율 계산
  const averageConversionRate = wishlistStats.reduce((sum, stat) => sum + stat.conversionRate, 0) / wishlistStats.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">찜 목록 분석</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 찜 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWishlists}</div>
            <p className="text-xs text-muted-foreground mt-1">전체 상품 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 전환율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(averageConversionRate * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">찜 → 구매 전환</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">인기 찜 상품</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {wishlistStats.sort((a, b) => b.wishlistCount - a.wishlistCount)[0]?.productTitle}
            </div>
            <p className="text-xs text-muted-foreground mt-1">가장 많이 찜한 상품</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>상품별 찜 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품명으로 검색"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품명</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("wishlistCount")}>
                      찜 횟수
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("conversionRate")}>
                      전환율
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("averageTimeToConversion")}
                    >
                      평균 전환 시간
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStats.map((stat) => (
                    <TableRow key={stat.productId}>
                      <TableCell className="font-medium max-w-[300px] truncate">{stat.productTitle}</TableCell>
                      <TableCell>{stat.wishlistCount}</TableCell>
                      <TableCell>{(stat.conversionRate * 100).toFixed(2)}%</TableCell>
                      <TableCell>{stat.averageTimeToConversion}일</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
