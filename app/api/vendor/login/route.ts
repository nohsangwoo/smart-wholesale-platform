import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 실제 환경에서는 데이터베이스에서 사용자 확인 및 비밀번호 검증
    // 여기서는 간단한 모의 구현
    if (email === "vendor@example.com" && password === "password123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "vendor-1",
          name: "홍길동",
          email: "vendor@example.com",
          companyName: "스마트 도매 솔루션",
          profileImage: "/abstract-blue-logo.png",
          rating: 4.8,
          reviewCount: 156,
        },
      })
    }

    return NextResponse.json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
