import { NextResponse } from "next/server"
import { mockVendors } from "@/lib/mock-vendors"

// 모킹된 업체 사용자 데이터
const mockVendorUser = {
  id: "vendor-1",
  email: "vendor@example.com",
  name: "김판매",
  companyName: "스마트텍",
  profileImage: "/abstract-blue-swirl.png",
  rating: 4.8,
  reviewCount: 342,
  verified: true,
  premium: true,
}

export async function POST(request: Request) {
  // 요청 본문에서 이메일과 비밀번호 추출
  const { email, password } = await request.json()

  // 인증 지연 시뮬레이션 (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 모킹된 인증 로직
  if (email === "vendor@example.com" && password === "vendor123!") {
    // 모킹된 업체 데이터에서 추가 정보 가져오기
    const vendorData = mockVendors.find((v) => v.id === "vendor-1")

    const vendor = {
      ...mockVendorUser,
      // 추가 정보가 있으면 병합
      ...(vendorData
        ? {
            profileImage: vendorData.profileImage,
            rating: vendorData.rating,
            reviewCount: vendorData.reviewCount,
            verified: vendorData.verified,
            premium: vendorData.premium,
          }
        : {}),
    }

    return NextResponse.json({
      success: true,
      vendor,
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
