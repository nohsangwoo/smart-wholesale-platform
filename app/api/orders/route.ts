import { NextResponse } from "next/server"
import { mockOrderDetails } from "@/lib/mock-data"
import type { ProductData } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { products, shippingInfo } = body

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: "상품 정보가 없습니다." }, { status: 400 })
    }

    // 주문 ID 생성
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // 총 금액 계산
    const totalAmount = products.reduce((sum: number, product: ProductData) => sum + product.estimatedPrice, 0)

    // 모의 주문 데이터 생성
    const orderData = {
      id: orderId,
      userId: "user-123", // 실제로는 인증된 사용자 ID
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      products,
      totalAmount,
      shippingAddress: `${shippingInfo.zipCode} ${shippingInfo.address} ${shippingInfo.detailAddress}`,
      shippingInfo,
    }

    // 실제로는 DB에 저장
    console.log("Order created:", orderData)

    // 모의 데이터에 추가 (실제 구현에서는 필요 없음)
    mockOrderDetails.push({
      ...orderData,
      product: products[0], // 이전 형식과의 호환성을 위해
    })

    return NextResponse.json({
      message: "주문이 성공적으로 접수되었습니다.",
      orderId,
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ message: "주문 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}
