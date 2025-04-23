"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  productId: string
  productTitle: string
  status: string
  orderDate: string
  totalAmount: number
  imageUrl: string
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        const data = await response.json()

        if (response.ok) {
          setOrders(data.orders)
        } else {
          throw new Error(data.message || "주문 내역을 불러오는 중 오류가 발생했습니다.")
        }
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "주문 내역을 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, isLoading, router, toast])

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
      default:
        return "outline"
    }
  }

  if (isLoading || isOrdersLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.push("/mypage")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            내 정보
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">주문 내역</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">내 주문 내역</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">주문 내역이 없습니다.</p>
            <Button variant="link" onClick={() => router.push("/")}>
              상품 둘러보기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">주문번호: {order.id}</p>
                        <p className="text-sm text-muted-foreground">주문일자: {order.orderDate}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.status) as any}>{order.status}</Badge>
                    </div>
                  </div>
                  <div className="p-4 flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={order.imageUrl || "/placeholder.svg"}
                        alt={order.productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{order.productTitle}</h3>
                      <p className="text-primary font-semibold">{order.totalAmount.toLocaleString()}원</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/mypage/orders/${order.id}`)}>
                      상세보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
