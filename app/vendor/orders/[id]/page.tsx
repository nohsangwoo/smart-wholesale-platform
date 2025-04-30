"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { VendorSidebar } from "@/components/vendor/sidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  History,
  Edit,
  Send,
  ChevronRight,
  Download,
} from "lucide-react"

interface OrderDetail {
  id: string
  status: string
  orderDate: string
  estimatedDeliveryDate: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    detailAddress: string
    zipCode: string
  }
  products: {
    id: string
    name: string
    quantity: number
    price: number
    totalPrice: number
    imageUrl: string
    options?: string
  }[]
  payment: {
    method: string
    totalAmount: number
    paidAt: string
    status: string
  }
  shipping: {
    status: string
    trackingNumber?: string
    carrier?: string
    requestNote?: string
  }
  history: {
    date: string
    status: string
    description: string
  }[]
  isMultiProduct: boolean
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading } = useVendorAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [showTrackingDialog, setShowTrackingDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push("/vendor/login")
    }
  }, [isMounted, isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      // 실제 구현에서는 API 호출로 대체
      fetchOrderDetail(params.id)
    }
  }, [isMounted, isAuthenticated, params.id])

  const fetchOrderDetail = (orderId: string) => {
    setLoading(true)
    // 모의 데이터 - 실제 구현에서는 API 호출로 대체
    setTimeout(() => {
      // 주문 ID에 따라 다른 데이터 반환 (단일 상품 또는 다중 상품)
      if (orderId === "ORD-2023-001") {
        setOrder({
          id: "ORD-2023-001",
          status: "pending",
          orderDate: "2023-06-15",
          estimatedDeliveryDate: "2023-06-25",
          customer: {
            name: "김철수",
            email: "kim@example.com",
            phone: "010-1234-5678",
            address: "서울시 강남구 테헤란로 123",
            detailAddress: "456호",
            zipCode: "06234",
          },
          products: [
            {
              id: "PROD-001",
              name: "스마트폰 케이스 (iPhone 14 Pro)",
              quantity: 500,
              price: 9000,
              totalPrice: 4500000,
              imageUrl: "/bulk-smartphone-cases.png",
            },
          ],
          payment: {
            method: "신용카드",
            totalAmount: 4500000,
            paidAt: "2023-06-15 14:30:25",
            status: "완료",
          },
          shipping: {
            status: "준비중",
            requestNote: "부재시 경비실에 맡겨주세요.",
          },
          history: [
            {
              date: "2023-06-15 14:30:25",
              status: "주문 접수",
              description: "주문이 성공적으로 접수되었습니다.",
            },
            {
              date: "2023-06-15 15:45:10",
              status: "결제 완료",
              description: "신용카드 결제가 완료되었습니다.",
            },
          ],
          isMultiProduct: false,
        })
      } else if (orderId === "ORD-2023-002") {
        setOrder({
          id: "ORD-2023-002",
          status: "processing",
          orderDate: "2023-06-10",
          estimatedDeliveryDate: "2023-06-20",
          customer: {
            name: "이영희",
            email: "lee@example.com",
            phone: "010-9876-5432",
            address: "서울시 서초구 서초대로 456",
            detailAddress: "789동 101호",
            zipCode: "06543",
          },
          products: [
            {
              id: "PROD-002",
              name: "블루투스 이어폰",
              quantity: 200,
              price: 30000,
              totalPrice: 6000000,
              imageUrl: "/bulk-bluetooth-earphones.png",
            },
          ],
          payment: {
            method: "계좌이체",
            totalAmount: 6000000,
            paidAt: "2023-06-10 10:15:30",
            status: "완료",
          },
          shipping: {
            status: "배송준비중",
            trackingNumber: "1234567890",
            carrier: "CJ대한통운",
            requestNote: "문 앞에 놓아주세요.",
          },
          history: [
            {
              date: "2023-06-10 10:15:30",
              status: "주문 접수",
              description: "주문이 성공적으로 접수되었습니다.",
            },
            {
              date: "2023-06-10 11:30:45",
              status: "결제 완료",
              description: "계좌이체 결제가 완료되었습니다.",
            },
            {
              date: "2023-06-12 09:20:15",
              status: "배송 준비중",
              description: "상품 포장이 완료되었습니다.",
            },
          ],
          isMultiProduct: false,
        })
      } else if (orderId === "ORD-2023-003") {
        setOrder({
          id: "ORD-2023-003",
          status: "shipped",
          orderDate: "2023-06-05",
          estimatedDeliveryDate: "2023-06-15",
          customer: {
            name: "박지민",
            email: "park@example.com",
            phone: "010-5555-7777",
            address: "경기도 성남시 분당구 판교로 789",
            detailAddress: "101동 1502호",
            zipCode: "13494",
          },
          products: [
            {
              id: "PROD-003",
              name: "보조배터리 10000mAh",
              quantity: 300,
              price: 12500,
              totalPrice: 3750000,
              imageUrl: "/portable-power-bank.png",
            },
          ],
          payment: {
            method: "무통장입금",
            totalAmount: 3750000,
            paidAt: "2023-06-05 16:45:20",
            status: "완료",
          },
          shipping: {
            status: "배송중",
            trackingNumber: "9876543210",
            carrier: "롯데택배",
            requestNote: "경비실에 맡겨주세요.",
          },
          history: [
            {
              date: "2023-06-05 16:45:20",
              status: "주문 접수",
              description: "주문이 성공적으로 접수되었습니다.",
            },
            {
              date: "2023-06-05 17:30:10",
              status: "결제 완료",
              description: "무통장입금 결제가 완료되었습니다.",
            },
            {
              date: "2023-06-07 10:15:30",
              status: "배송 준비중",
              description: "상품 포장이 완료되었습니다.",
            },
            {
              date: "2023-06-08 09:30:45",
              status: "배송중",
              description: "배송이 시작되었습니다.",
            },
          ],
          isMultiProduct: false,
        })
      } else if (orderId === "ORD-2023-004") {
        setOrder({
          id: "ORD-2023-004",
          status: "delivered",
          orderDate: "2023-05-28",
          estimatedDeliveryDate: "2023-06-07",
          customer: {
            name: "최수진",
            email: "choi@example.com",
            phone: "010-2222-3333",
            address: "인천시 연수구 송도동 123-45",
            detailAddress: "퍼스트타워 2003호",
            zipCode: "21985",
          },
          products: [
            {
              id: "PROD-004",
              name: "노트북 파우치 15인치",
              quantity: 150,
              price: 15000,
              totalPrice: 2250000,
              imageUrl: "/laptop-sleeve.png",
            },
          ],
          payment: {
            method: "신용카드",
            totalAmount: 2250000,
            paidAt: "2023-05-28 11:20:35",
            status: "완료",
          },
          shipping: {
            status: "배송완료",
            trackingNumber: "5432167890",
            carrier: "한진택배",
            requestNote: "부재시 연락주세요.",
          },
          history: [
            {
              date: "2023-05-28 11:20:35",
              status: "주문 접수",
              description: "주문이 성공적으로 접수되었습니다.",
            },
            {
              date: "2023-05-28 11:45:50",
              status: "결제 완료",
              description: "신용카드 결제가 완료되었습니다.",
            },
            {
              date: "2023-05-30 09:10:25",
              status: "배송 준비중",
              description: "상품 포장이 완료되었습니다.",
            },
            {
              date: "2023-05-31 08:30:15",
              status: "배송중",
              description: "배송이 시작되었습니다.",
            },
            {
              date: "2023-06-02 14:25:40",
              status: "배송완료",
              description: "배송이 완료되었습니다.",
            },
          ],
          isMultiProduct: false,
        })
      } else if (orderId === "ORD-2023-005") {
        // 다중 상품 주문 예시
        setOrder({
          id: "ORD-2023-005",
          status: "pending",
          orderDate: "2023-06-14",
          estimatedDeliveryDate: "2023-06-24",
          customer: {
            name: "정민수",
            email: "jung@example.com",
            phone: "010-8888-9999",
            address: "부산시 해운대구 해운대로 678",
            detailAddress: "마린시티 A동 3201호",
            zipCode: "48099",
          },
          products: [
            {
              id: "PROD-005-1",
              name: "무선 충전기",
              quantity: 200,
              price: 18000,
              totalPrice: 3600000,
              imageUrl: "/wireless-charger.png",
            },
            {
              id: "PROD-005-2",
              name: "스마트워치 밴드",
              quantity: 100,
              price: 8000,
              totalPrice: 800000,
              imageUrl: "/smartwatch-band-variety.png",
              options: "블랙, 화이트, 블루 각 30개씩, 레드 10개",
            },
            {
              id: "PROD-005-3",
              name: "블루투스 스피커",
              quantity: 50,
              price: 16000,
              totalPrice: 800000,
              imageUrl: "/bluetooth-speaker.png",
            },
          ],
          payment: {
            method: "신용카드",
            totalAmount: 5200000,
            paidAt: "2023-06-14 13:40:55",
            status: "완료",
          },
          shipping: {
            status: "준비중",
            requestNote: "배송 전 연락 부탁드립니다.",
          },
          history: [
            {
              date: "2023-06-14 13:40:55",
              status: "주문 접수",
              description: "주문이 성공적으로 접수되었습니다.",
            },
            {
              date: "2023-06-14 13:55:30",
              status: "결제 완료",
              description: "신용카드 결제가 완료되었습니다.",
            },
          ],
          isMultiProduct: true,
        })
      } else {
        // 기본 주문 데이터
        setOrder({
          id: params.id,
          status: "pending",
          orderDate: "2023-06-15",
          estimatedDeliveryDate: "2023-06-25",
          customer: {
            name: "홍길동",
            email: "hong@example.com",
            phone: "010-1111-2222",
            address: "서울시 중구 세종대로 110",
            detailAddress: "서울시청 1층",
            zipCode: "04524",
          },
          products: [
            {
              id: "PROD-DEFAULT",
              name: "기본 상품",
              quantity: 100,
              price: 10000,
              totalPrice: 1000000,
              imageUrl: "/diverse-products-still-life.png",
            },
          ],
          payment: {
            method: "신용카드",
            totalAmount: 1000000,
            paidAt: "2023-06-15 09:00:00",
            status: "완료",
          },
          shipping: {
            status: "준비중",
            requestNote: "조심히 배송해주세요.",
          },
          history: [
            {
              date: "2023-06-15 09:00:00",
              status: "주문 접수",
              description: "주문이 성공적으로 접수되었습니다.",
            },
            {
              date: "2023-06-15 09:15:00",
              status: "결제 완료",
              description: "신용카드 결제가 완료되었습니다.",
            },
          ],
          isMultiProduct: false,
        })
      }
      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>결제 대기</span>
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800">
            <Package className="h-3 w-3" />
            <span>배송 준비중</span>
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800">
            <Truck className="h-3 w-3" />
            <span>배송중</span>
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            <span>배송 완료</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const updateOrderStatus = (newStatus: string) => {
    if (!order) return

    // 실제 구현에서는 API 호출로 대체
    const updatedOrder = { ...order }
    updatedOrder.status = newStatus

    // 배송 상태 업데이트
    if (newStatus === "processing") {
      updatedOrder.shipping.status = "배송준비중"
    } else if (newStatus === "shipped") {
      updatedOrder.shipping.status = "배송중"
    } else if (newStatus === "delivered") {
      updatedOrder.shipping.status = "배송완료"
    }

    // 주문 이력 추가
    const now = new Date()
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

    let description = ""
    if (newStatus === "processing") {
      description = "상품 포장이 완료되었습니다."
    } else if (newStatus === "shipped") {
      description = "배송이 시작되었습니다."
    } else if (newStatus === "delivered") {
      description = "배송이 완료되었습니다."
    }

    updatedOrder.history.push({
      date: formattedDate,
      status: getStatusText(newStatus),
      description,
    })

    setOrder(updatedOrder)
    toast({
      title: "주문 상태 업데이트",
      description: `주문 상태가 ${getStatusText(newStatus)}(으)로 변경되었습니다.`,
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "결제 대기"
      case "processing":
        return "배송 준비중"
      case "shipped":
        return "배송중"
      case "delivered":
        return "배송 완료"
      default:
        return status
    }
  }

  const updateTrackingInfo = () => {
    if (!order) return

    // 실제 구현에서는 API 호출로 대체
    const updatedOrder = { ...order }
    updatedOrder.shipping.trackingNumber = trackingNumber
    updatedOrder.shipping.carrier = carrier

    // 주문 이력 추가
    const now = new Date()
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

    updatedOrder.history.push({
      date: formattedDate,
      status: "운송장 등록",
      description: `운송장 번호(${trackingNumber})가 등록되었습니다.`,
    })

    setOrder(updatedOrder)
    setShowTrackingDialog(false)
    toast({
      title: "운송장 정보 업데이트",
      description: "운송장 정보가 성공적으로 등록되었습니다.",
    })
  }

  const sendMessage = () => {
    if (!messageContent.trim()) return

    // 실제 구현에서는 API 호출로 대체
    toast({
      title: "메시지 전송 완료",
      description: "고객에게 메시지가 성공적으로 전송되었습니다.",
    })
    setMessageContent("")
    setShowMessageDialog(false)
  }

  // 로딩 중이거나 인증되지 않은 경우
  if (!isMounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (loading || !order) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <VendorSidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center space-x-2 mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
            <h1 className="text-2xl font-bold">주문 상세 정보 로딩 중...</h1>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">주문 상세 정보</h1>
          {getStatusBadge(order.status)}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 주문 요약 정보 */}
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">주문 #{order.id}</CardTitle>
                <CardDescription>
                  주문일: {order.orderDate} | 예상 배송일: {order.estimatedDeliveryDate}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      고객에게 메시지
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>고객에게 메시지 보내기</DialogTitle>
                      <DialogDescription>{order.customer.name} 고객에게 메시지를 보냅니다.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Textarea
                        placeholder="메시지 내용을 입력하세요..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                        취소
                      </Button>
                      <Button onClick={sendMessage}>
                        <Send className="h-4 w-4 mr-2" />
                        메시지 보내기
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  인보이스 출력
                </Button>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  주문서 다운로드
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    주문 상태
                  </h3>
                  <p className="font-medium">{getStatusText(order.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                    <User className="h-4 w-4 mr-1" />
                    고객명
                  </h3>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                    <CreditCard className="h-4 w-4 mr-1" />
                    결제 방법
                  </h3>
                  <p className="font-medium">{order.payment.method}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                    <Truck className="h-4 w-4 mr-1" />
                    배송 상태
                  </h3>
                  <p className="font-medium">{order.shipping.status}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <div className="flex space-x-2">
                {order.status === "pending" && (
                  <Button onClick={() => updateOrderStatus("processing")}>
                    <Package className="h-4 w-4 mr-2" />
                    배송 준비 시작
                  </Button>
                )}
                {order.status === "processing" && (
                  <>
                    <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Truck className="h-4 w-4 mr-2" />
                          운송장 등록
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>운송장 정보 등록</DialogTitle>
                          <DialogDescription>배송 추적을 위한 운송장 정보를 입력하세요.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="carrier">택배사</Label>
                            <Select value={carrier} onValueChange={setCarrier}>
                              <SelectTrigger>
                                <SelectValue placeholder="택배사 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cj">CJ대한통운</SelectItem>
                                <SelectItem value="lotte">롯데택배</SelectItem>
                                <SelectItem value="hanjin">한진택배</SelectItem>
                                <SelectItem value="post">우체국택배</SelectItem>
                                <SelectItem value="logen">로젠택배</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tracking">운송장 번호</Label>
                            <Input
                              id="tracking"
                              placeholder="운송장 번호를 입력하세요"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowTrackingDialog(false)}>
                            취소
                          </Button>
                          <Button onClick={updateTrackingInfo}>등록</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={() => updateOrderStatus("shipped")}>
                      <Truck className="h-4 w-4 mr-2" />
                      배송 시작
                    </Button>
                  </>
                )}
                {order.status === "shipped" && (
                  <Button onClick={() => updateOrderStatus("delivered")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    배송 완료 처리
                  </Button>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">총 주문금액</p>
                <p className="text-xl font-bold">{order.payment.totalAmount.toLocaleString()}원</p>
              </div>
            </CardFooter>
          </Card>

          {/* 주문 상세 정보 탭 */}
          <div className="md:col-span-2">
            <Tabs defaultValue="products">
              <TabsList className="mb-4">
                <TabsTrigger value="products">주문 상품</TabsTrigger>
                <TabsTrigger value="customer">고객 정보</TabsTrigger>
                <TabsTrigger value="shipping">배송 정보</TabsTrigger>
                <TabsTrigger value="history">주문 이력</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>주문 상품 정보</CardTitle>
                    <CardDescription>
                      {order.isMultiProduct ? `총 ${order.products.length}개 상품` : "주문 상품 상세 정보"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {order.products.map((product, index) => (
                      <div
                        key={product.id}
                        className={`flex items-start space-x-4 ${index > 0 ? "mt-6 pt-6 border-t" : ""}`}
                      >
                        <div className="w-20 h-20 relative flex-shrink-0">
                          <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-gray-500">단가:</span> {product.price.toLocaleString()}원
                            </div>
                            <div>
                              <span className="text-gray-500">수량:</span> {product.quantity.toLocaleString()}개
                            </div>
                            {product.options && (
                              <div className="col-span-2">
                                <span className="text-gray-500">옵션:</span> {product.options}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{product.totalPrice.toLocaleString()}원</p>
                        </div>
                      </div>
                    ))}
                    <Separator className="my-6" />
                    <div className="flex justify-between">
                      <span className="font-medium">총 주문금액</span>
                      <span className="font-bold text-lg">{order.payment.totalAmount.toLocaleString()}원</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customer">
                <Card>
                  <CardHeader>
                    <CardTitle>고객 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">고객명</p>
                          <p className="font-medium">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">연락처</p>
                          <p className="font-medium">{order.customer.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">이메일</p>
                          <p className="font-medium">{order.customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">배송지 주소</p>
                          <p className="font-medium">[{order.customer.zipCode}]</p>
                          <p className="font-medium">{order.customer.address}</p>
                          <p className="font-medium">{order.customer.detailAddress}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping">
                <Card>
                  <CardHeader>
                    <CardTitle>배송 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">배송 상태</p>
                        <p className="font-medium">{order.shipping.status}</p>
                      </div>
                      {order.shipping.trackingNumber && (
                        <div>
                          <p className="text-sm text-gray-500">운송장 정보</p>
                          <p className="font-medium">
                            {order.shipping.carrier} - {order.shipping.trackingNumber}
                          </p>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm"
                            onClick={() => window.open(`https://tracker.delivery/`, "_blank")}
                          >
                            배송 추적하기 <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      )}
                      {order.shipping.requestNote && (
                        <div>
                          <p className="text-sm text-gray-500">배송 요청사항</p>
                          <Alert className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>배송 요청사항</AlertTitle>
                            <AlertDescription>{order.shipping.requestNote}</AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>주문 이력</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
                      {order.history.map((item, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[25px] bg-white rounded-full p-1 border-2 border-gray-200">
                            <History className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{item.date}</p>
                            <p className="font-medium">{item.status}</p>
                            <p className="text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 사이드바 정보 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>결제 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제 방법</span>
                    <span>{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제 상태</span>
                    <span>{order.payment.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제 일시</span>
                    <span>{order.payment.paidAt}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>총 결제금액</span>
                    <span>{order.payment.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  인보이스 생성
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  고객에게 연락
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  주문 정보 수정
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
