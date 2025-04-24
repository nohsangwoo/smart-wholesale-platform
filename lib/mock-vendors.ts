// 모킹된 업체 데이터
export interface Vendor {
  id: string
  name: string
  rating: number
  reviewCount: number
  verified: boolean
  premium: boolean
  description: string
  responseTime: string
  successRate: number
  completedOrders: number
  profileImage: string
  tags: string[]
}

export interface VendorQuote {
  vendorId: string
  orderId: string
  price: number
  estimatedDeliveryDays: number
  description: string
  additionalFees: {
    serviceFee: number
    shippingFee: number
    taxFee: number
    otherFees?: number
  }
  createdAt: string
}

// 모킹된 업체 데이터
export const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "스마트텍",
    rating: 4.8,
    reviewCount: 342,
    verified: true,
    premium: true,
    description: "10년 경력의 해외 구매 대행 전문 업체입니다. 빠르고 정확한 서비스를 제공합니다.",
    responseTime: "평균 30분 이내",
    successRate: 98,
    completedOrders: 1245,
    profileImage: "/abstract-blue-swirl.png",
    tags: ["빠른배송", "정품보장", "A/S가능"],
  },
  {
    id: "vendor-2",
    name: "글로벌옵션",
    rating: 4.6,
    reviewCount: 215,
    verified: true,
    premium: false,
    description: "합리적인 가격으로 고품질 구매 대행 서비스를 제공합니다.",
    responseTime: "평균 1시간 이내",
    successRate: 95,
    completedOrders: 876,
    profileImage: "/abstract-green-swirl.png",
    tags: ["가격보장", "친절상담", "다양한상품"],
  },
  {
    id: "vendor-3",
    name: "이젠로지스틱",
    rating: 4.9,
    reviewCount: 189,
    verified: true,
    premium: true,
    description: "최고의 물류 시스템으로 안전하고 빠른 배송을 약속합니다.",
    responseTime: "평균 15분 이내",
    successRate: 99,
    completedOrders: 932,
    profileImage: "/abstract-red-swirl.png",
    tags: ["프리미엄", "안전배송", "실시간추적"],
  },
  {
    id: "vendor-4",
    name: "대한민국특송물류",
    rating: 4.5,
    reviewCount: 156,
    verified: true,
    premium: false,
    description: "20년 전통의 특송 물류 전문 업체입니다. 안전한 배송을 약속합니다.",
    responseTime: "평균 2시간 이내",
    successRate: 94,
    completedOrders: 1532,
    profileImage: "/stylized-korean-elements.png",
    tags: ["대량주문", "기업특화", "통관전문"],
  },
  {
    id: "vendor-5",
    name: "고고로지스",
    rating: 4.7,
    reviewCount: 124,
    verified: true,
    premium: false,
    description: "신속하고 정확한 구매 대행 서비스를 제공합니다.",
    responseTime: "평균 1시간 이내",
    successRate: 96,
    completedOrders: 687,
    profileImage: "/placeholder.svg?height=100&width=100&query=logistics-network",
    tags: ["신속배송", "정확한견적", "친절상담"],
  },
  {
    id: "vendor-6",
    name: "무신사물티미디어",
    rating: 4.8,
    reviewCount: 218,
    verified: true,
    premium: true,
    description: "패션 전문 구매 대행 서비스입니다. 최신 트렌드 상품을 빠르게 구매 대행해 드립니다.",
    responseTime: "평균 45분 이내",
    successRate: 97,
    completedOrders: 1123,
    profileImage: "/placeholder.svg?height=100&width=100&query=fashion-logo",
    tags: ["패션전문", "트렌드", "품질보증"],
  },
]

// 주문에 대한 견적 생성 함수
export function generateMockQuotes(orderId: string, productPrice: number): VendorQuote[] {
  if (!orderId) {
    console.error("Invalid orderId provided to generateMockQuotes")
    throw new Error("Invalid orderId")
  }

  if (!productPrice || isNaN(productPrice)) {
    console.error("Invalid productPrice provided to generateMockQuotes:", productPrice)
    throw new Error("Invalid productPrice")
  }

  console.log(`Generating quotes for orderId: ${orderId}, price: ${productPrice}`)

  return mockVendors.map((vendor) => {
    // 기본 가격에서 +/- 20% 범위 내에서 랜덤 가격 생성
    const priceVariation = productPrice * (0.8 + Math.random() * 0.4)
    const price = Math.round(priceVariation / 1000) * 1000 // 천원 단위로 반올림

    // 배송 기간 (5~15일 사이 랜덤)
    const estimatedDeliveryDays = Math.floor(Math.random() * 11) + 5

    // 서비스 수수료 (5~10% 사이 랜덤)
    const serviceFeeRate = 0.05 + Math.random() * 0.05
    const serviceFee = Math.round((price * serviceFeeRate) / 100) * 100

    // 배송비 (10000~30000원 사이 랜덤)
    const initialShippingFee = Math.round((10000 + Math.random() * 20000) / 1000) * 1000

    // 관세 (8~12% 사이 랜덤)
    const taxFeeRate = 0.08 + Math.random() * 0.04
    const taxFee = Math.round((price * taxFeeRate) / 100) * 100

    // 기타 수수료 (프리미엄 업체는 추가 수수료 있음)
    const otherFees = vendor.premium ? Math.round((5000 + Math.random() * 10000) / 1000) * 1000 : 0

    // 견적 설명 생성
    const descriptions = [
      "최상의 품질과 빠른 배송을 약속드립니다.",
      "정품 보장 및 안전한 배송을 제공합니다.",
      "합리적인 가격으로 최고의 서비스를 제공합니다.",
      "전문적인 구매 대행 서비스로 만족을 드립니다.",
      "신속한 처리와 정확한 배송을 약속합니다.",
    ]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]

    // 견적 생성 시간 (최근 24시간 내 랜덤)
    const now = new Date()
    const hoursAgo = Math.floor(Math.random() * 24)
    const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString()

    return {
      vendorId: vendor.id,
      orderId,
      price,
      estimatedDeliveryDays,
      description,
      additionalFees: {
        serviceFee,
        shippingFee: initialShippingFee,
        taxFee,
        otherFees,
      },
      createdAt,
    }
  })
}
