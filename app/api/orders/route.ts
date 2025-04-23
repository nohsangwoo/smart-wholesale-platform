import { NextResponse } from "next/server"
import { mockOrders } from "@/lib/mock-data"

export async function GET() {
  // 지연 시뮬레이션 (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    orders: mockOrders,
  })
}

export async function POST(request: Request) {
  const orderData = await request.json()

  // 지연 시뮬레이션 (1초)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 새 주문 생성 (모킹)
  const newOrder = {
    id: `order-${Date.now()}`,
    status: "관리자 승인 대기",
    orderDate: new Date().toISOString().split("T")[0],
    ...orderData,
  }

  return NextResponse.json({
    success: true,
    order: newOrder,
  })
}
