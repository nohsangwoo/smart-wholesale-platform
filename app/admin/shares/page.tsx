"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowUpDown } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"

// 모킹된 공유 통계 데이터
const mockShareStats = mockProducts.map((product) => ({
  productId: product.id,
  productTitle: product.title,
  shareCount: Math.floor(Math.random() * 30) + 1,
  clickCount: Math.floor(Math.random() * 100) + 10,
  conversionRate: Math.random() * 0.15,
  platforms: {
    facebook: Math.floor(Math.random() * 15) + 1,
    twitter: Math.floor(Math.random() * 10) + 1,
    email: Math.floor(Math.random() * 8) + 1,
    link: Math.floor(Math.random() * 20) + 1,
  },
}))

export default function AdminSharesPage() {
  const [shareStats, setShareStats] = useState(mockShareStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({
    key: "shareCount",
    direction: "descending",
  })

  const filteredStats = shareStats
    .filter((stat) => stat.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortConfig.key === "shareCount") {
        return sortConfig.direction === "ascending" ? a.shareCount - b.shareCount : b.shareCount - a.shareCount
      } else if (sortConfig.key === "clickCount") {
        return sortConfig.direction === "ascending" ? a.clickCount - b.clickCount : b.clickCount - a.clickCount
      } else if (sortConfig.key === "conversionRate") {
        return sortConfig.direction === "ascending"
          ? a.conversionRate - b.conversionRate
          : b.conversionRate - a.conversionRate
      }
      return 0
    })

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  // 총 공유 수 계산
  const totalShares = shareStats.reduce((sum, stat) => sum + stat.shareCount, 0)

  // 총 클릭 수 계산
  const totalClicks = shareStats.reduce((sum, stat) => sum + stat.clickCount, 0)

  // 평균 클릭률 계산
  const averageClickRate = totalShares > 0 ? totalClicks / totalShares : 0

  // 플랫폼별 공유 수 계산
  const platformShares = {
    facebook: shareStats.reduce((sum, stat) => sum + stat.platforms.facebook, 0),
    twitter: shareStats.reduce((sum, stat) => sum + stat.platforms.twitter, 0),
    email: shareStats.reduce((sum, stat) => sum + stat.platforms.email, 0),
    link: shareStats.reduce((sum, stat) => sum + stat.platforms.link, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">공유 통계</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 공유 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares}</div>
            <p className="text-xs text-muted-foreground mt-1">전체 상품 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 클릭 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">공유 링크 클릭</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 클릭률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(averageClickRate * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">공유당 클릭 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">인기 공유 플랫폼</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.entries(platformShares).sort((a, b) => b[1] - a[1])[0][0]}</div>
            <p className="text-xs text-muted-foreground mt-1">가장 많이 사용된 플랫폼</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>플랫폼별 공유 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(platformShares).map(([platform, count]) => (
              <div key={platform} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{platform}</span>
                  <span className="font-medium">{count} 공유</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${(count / Math.max(...Object.values(platformShares))) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>상품별 공유 통계</CardTitle>
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
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("shareCount")}>
                      공유 횟수
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("clickCount")}>
                      클릭 횟수
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("conversionRate")}>
                      전환율
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>주요 플랫폼</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStats.map((stat) => (
                    <TableRow key={stat.productId}>
                      <TableCell className="font-medium max-w-[300px] truncate">{stat.productTitle}</TableCell>
                      <TableCell>{stat.shareCount}</TableCell>
                      <TableCell>{stat.clickCount}</TableCell>
                      <TableCell>{(stat.conversionRate * 100).toFixed(2)}%</TableCell>
                      <TableCell>{Object.entries(stat.platforms).sort((a, b) => b[1] - a[1])[0][0]}</TableCell>
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
