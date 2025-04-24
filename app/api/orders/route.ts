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

  // 유효한 주문 ID 목록 (모킹 데이터에 있는 ID들)
  const validOrderIds = ["order-1", "order-2", "order-3", "order-4", "order-5", "order-6", "order-7", "order-8"]

  // 새 주문 생성 (모킹)
  // 실제 환경에서는 고유한 ID를 생성하지만, 테스트를 위해 기존 유효한 ID 중 하나를 사용
  const newOrder = {
    id: validOrderIds[0], // 테스트를 위해 항상 유효한 ID 사용
    status: "관리자 승인 대기",
    orderDate: new Date().toISOString().split("T")[0],
    ...orderData,
  }

  console.log("Created new order:", newOrder.id)

  return NextResponse.json({
    success: true,
    order: newOrder,
  })
}
