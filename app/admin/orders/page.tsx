"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpDown, Eye, Package, FileText } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({
    key: "orderDate",
    direction: "descending",
  })

  useEffect(() => {
    // 검색어와 상태 필터 적용
    let result = orders

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.productTitle.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // 정렬 적용
    result = [...result].sort((a, b) => {
      if (sortConfig.key === "orderDate") {
        const dateA = new Date(a.orderDate).getTime()
        const dateB = new Date(b.orderDate).getTime()
        return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA
      } else if (sortConfig.key === "totalAmount") {
        return sortConfig.direction === "ascending" ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount
      }
      return 0
    })

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "배송 준비중":
        return "default"
      case "배송중":
        return "secondary"
      case "배송 완료":
        return "success"
      case "관리자 승인 대기":
        return "warning"
      case "결제 대기":
        return "outline"
      case "주문 취소":
        return "destructive"
      case "견적 요청":
        return "secondary"
      default:
        return "outline"
    }
  }

  // 주문에 포함된 상품 개수 표시 함수
  const getProductCountBadge = (count: number) => {
    if (count <= 1) return null

    return (
      <Badge variant="secondary" className="ml-2">
        <Package className="h-3 w-3 mr-1" />
        {count}개 상품
      </Badge>
    )
  }

  // 견적 요청 뱃지 표시 함수
  const getQuoteBadge = (isQuoteRequest: boolean) => {
    if (!isQuoteRequest) return null

    return (
      <Badge variant="outline" className="ml-2 border-blue-500 text-blue-500">
        <FileText className="h-3 w-3 mr-1" />
        견적 요청
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">주문 관리</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="주문번호 또는 상품명으로 검색"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="견적 요청">견적 요청</SelectItem>
                  <SelectItem value="관리자 승인 대기">관리자 승인 대기</SelectItem>
                  <SelectItem value="결제 대기">결제 대기</SelectItem>
                  <SelectItem value="배송 준비중">배송 준비중</SelectItem>
                  <SelectItem value="배송중">배송중</SelectItem>
                  <SelectItem value="배송 완료">배송 완료</SelectItem>
                  <SelectItem value="주문 취소">주문 취소</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>주문일자</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("totalAmount")}>
                      금액
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    // 모의 데이터에서 일부 주문을 견적 요청으로 표시 (실제 구현에서는 API에서 받아온 데이터 사용)
                    const isQuoteRequest = order.id.charCodeAt(0) % 5 === 0
                    const productCount = (order.id.charCodeAt(0) % 3) + 1
                    const status = isQuoteRequest ? "견적 요청" : order.status

                    return (
                      <TableRow key={order.id} className={isQuoteRequest ? "bg-blue-50" : ""}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {order.productTitle}
                          {getProductCountBadge(productCount)}
                          {getQuoteBadge(isQuoteRequest)}
                        </TableCell>
                        <TableCell>
                          {isQuoteRequest ? "견적 요청 중" : `${order.totalAmount.toLocaleString()}원`}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(status) as any}>{status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">상세보기</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
