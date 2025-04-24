"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpDown, Eye, MessageSquare, Clock, CheckCircle, Truck, Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOrderDetails } from "@/lib/mock-data"
import { ChatModal } from "@/components/chat/chat-modal"

export default function VendorOrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({
    key: "orderDate",
    direction: "descending",
  })

  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [processingOrders, setProcessingOrders] = useState<any[]>([])
  const [shippingOrders, setShippingOrders] = useState<any[]>([])
  const [completedOrders, setCompletedOrders] = useState<any[]>([])
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    // 모의 데이터 로드
    loadMockData()
  }, [])

  const loadMockData = () => {
    // 모의 주문 데이터 (업체 ID가 vendor-1인 주문만 필터링)
    const vendorOrders = mockOrderDetails.filter((order) => {
      // 실제로는 주문에 업체 ID가 있어야 하지만, 모의 데이터에서는 임의로 처리
      return Math.random() > 0.5 // 50% 확률로 이 업체의 주문으로 간주
    })

    // 각 주문에 고객 정보 추가
    const enrichedOrders = vendorOrders.map((order) => ({
      ...order,
      customerName: "고객 " + Math.floor(Math.random() * 100),
      customerId: "customer-" + Math.floor(Math.random() * 100),
    }))

    // 상태별로 분류
    setPendingOrders(
      enrichedOrders.filter((order) => order.status === "관리자 승인 대기" || order.status === "결제 대기"),
    )
    setProcessingOrders(enrichedOrders.filter((order) => order.status === "배송 준비중"))
    setShippingOrders(enrichedOrders.filter((order) => order.status === "배송중"))
    setCompletedOrders(enrichedOrders.filter((order) => order.status === "배송 완료"))
  }

  const getFilteredOrders = (orders: any[]) => {
    let result = [...orders]

    // 검색어 필터링
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 정렬 적용
    result.sort((a, b) => {
      if (sortConfig.key === "orderDate") {
        const dateA = new Date(a.orderDate).getTime()
        const dateB = new Date(b.orderDate).getTime()
        return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA
      } else if (sortConfig.key === "totalAmount") {
        return sortConfig.direction === "ascending" ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount
      }
      return 0
    })

    return result
  }

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  const handleOpenChat = (customerId: string, customerName: string) => {
    setSelectedCustomer({
      id: customerId,
      name: customerName,
    })
    setIsChatModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "관리자 승인 대기":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            승인 대기
          </Badge>
        )
      case "결제 대기":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            결제 대기
          </Badge>
        )
      case "배송 준비중":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            배송 준비중
          </Badge>
        )
      case "배송중":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            배송중
          </Badge>
        )
      case "배송 완료":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            배송 완료
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">주문 관리</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="주문번호, 상품명 또는 고객명으로 검색"
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
              <SelectItem value="pending">승인/결제 대기</SelectItem>
              <SelectItem value="processing">배송 준비중</SelectItem>
              <SelectItem value="shipping">배송중</SelectItem>
              <SelectItem value="completed">배송 완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            승인/결제 대기
            {pendingOrders.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{pendingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processing" className="relative">
            배송 준비중
            {processingOrders.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{processingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shipping">배송중</TabsTrigger>
          <TabsTrigger value="completed">배송 완료</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>승인/결제 대기 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("orderDate")}>
                          주문일자
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>고객명</TableHead>
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
                    {getFilteredOrders(pendingOrders).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          승인/결제 대기 중인 주문이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredOrders(pendingOrders).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{order.product.title}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.totalAmount.toLocaleString()}원</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/orders/${order.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(order.customerId, order.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>배송 준비중 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("orderDate")}>
                          주문일자
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>고객명</TableHead>
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
                    {getFilteredOrders(processingOrders).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          배송 준비중인 주문이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredOrders(processingOrders).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{order.product.title}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.totalAmount.toLocaleString()}원</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/orders/${order.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(order.customerId, order.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>배송중 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("orderDate")}>
                          주문일자
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>고객명</TableHead>
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
                    {getFilteredOrders(shippingOrders).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          배송중인 주문이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredOrders(shippingOrders).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{order.product.title}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.totalAmount.toLocaleString()}원</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/orders/${order.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(order.customerId, order.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>배송 완료 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("orderDate")}>
                          주문일자
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>고객명</TableHead>
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
                    {getFilteredOrders(completedOrders).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          배송 완료된 주문이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredOrders(completedOrders).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{order.product.title}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.totalAmount.toLocaleString()}원</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/vendor/orders/${order.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChat(order.customerId, order.customerName)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">채팅하기</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={selectedCustomer?.id}
        vendorName={selectedCustomer?.name}
      />
    </div>
  )
}
