import { NextResponse } from "next/server"

// 모킹된 관리자 데이터
const mockAdmin = {
  id: "admin-1",
  email: "admin@example.com",
  name: "관리자",
  role: "admin",
}

export async function POST(request: Request) {
  // 요청 본문에서 이메일과 비밀번호 추출
  const { email, password } = await request.json()

  // 인증 지연 시뮬레이션 (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 모킹된 인증 로직
  if (email === "admin@example.com" && password === "admin123!") {
    return NextResponse.json({
      success: true,
      admin: mockAdmin,
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
