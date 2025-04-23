import { NextResponse } from "next/server"

// 모킹된 사용자 데이터
const mockUser = {
  id: "user-1",
  email: "test@test.com",
  name: "테스트 사용자",
  phone: "010-1234-5678",
  address: "서울특별시 강남구",
  detailAddress: "테헤란로 123",
  zipCode: "06123",
}

export async function POST(request: Request) {
  // 요청 본문에서 이메일과 비밀번호 추출
  const { email, password } = await request.json()

  // 인증 지연 시뮬레이션 (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 모킹된 인증 로직
  if (email === "test@test.com" && password === "test12!") {
    return NextResponse.json({
      success: true,
      user: mockUser,
    })
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      },
      { status: 401 },
    )
  }
}
