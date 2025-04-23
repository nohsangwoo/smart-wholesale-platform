import { type NextRequest, NextResponse } from "next/server"
import { mockOrderDetails } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const orderId = params.id

  // 지연 시뮬레이션 (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 주문 ID로 상세 정보 찾기
  const order = mockOrderDetails.find((order) => order.id === orderId)

  if (!order) {
    return NextResponse.json(
      {
        success: false,
        message: "주문을 찾을 수 없습니다.",
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    order,
  })
}
