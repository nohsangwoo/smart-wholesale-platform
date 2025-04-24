import type { ProductData } from "./types"
import { mockProducts } from "./mock-data"

// URL에서 도메인 추출 함수
function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    if (domain.includes("alibaba.com")) return "Alibaba"
    if (domain.includes("taobao.com")) return "Taobao"
    if (domain.includes("1688.com")) return "1688"
    return "기타 쇼핑몰"
  } catch (error) {
    return "알 수 없음"
  }
}

// 가격 계산 함수 (같은 URL에 대해 항상 같은 결과 반환)
function calculatePrice(url: string, originalPrice: number): number {
  // URL을 기반으로 일관된 난수 생성
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i)
    hash |= 0 // 32비트 정수로 변환
  }

  // 1.3 ~ 1.35 사이의 일관된 마진율 생성
  const marginRate = 1.3 + (Math.abs(hash) % 6) / 100

  // 10의 자리에서 올림
  const calculatedPrice = originalPrice * marginRate
  return Math.ceil(calculatedPrice / 10) * 10
}

// 상품 분석 함수
export async function analyzeProduct(url: string): Promise<ProductData> {
  // URL 디코딩
  const decodedUrl = decodeURIComponent(url)

  // 모의 데이터에서 랜덤하게 상품 선택
  const randomIndex = Math.abs(decodedUrl.length) % mockProducts.length
  const mockProduct = mockProducts[randomIndex]

  // 플랫폼 정보 추출
  const platform = extractDomain(decodedUrl)

  // 예상 가격 계산
  const estimatedPrice = calculatePrice(decodedUrl, mockProduct.originalPrice)

  // 수수료, 관세, 배송비 계산
  const fees = Math.round(mockProduct.originalPrice * 0.05)
  const tax = Math.round(mockProduct.originalPrice * 0.08)
  const shippingCost = 15000 + Math.round(Math.random() * 10000)

  // Ensure image URL is valid or use placeholder
  const imageUrl =
    mockProduct.imageUrl && mockProduct.imageUrl.startsWith("/")
      ? mockProduct.imageUrl
      : `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(mockProduct.title || "product")}`

  return {
    ...mockProduct,
    platform,
    estimatedPrice,
    fees,
    tax,
    shippingCost,
    originalUrl: decodedUrl,
    imageUrl, // Use the validated image URL
  }
}

// ID로 상품 조회 함수
export async function getProductById(id: string): Promise<ProductData> {
  // 모의 데이터에서 ID로 상품 찾기
  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.")
  }

  // 예상 가격 계산 (ID 기반)
  const estimatedPrice = Math.ceil((product.originalPrice * 1.3) / 10) * 10

  // 수수료, 관세, 배송비 계산
  const fees = Math.round(product.originalPrice * 0.05)
  const tax = Math.round(product.originalPrice * 0.08)
  const shippingCost = 15000 + Math.round(Math.random() * 10000)

  return {
    ...product,
    platform: "Alibaba", // 기본값
    estimatedPrice,
    fees,
    tax,
    shippingCost,
    originalUrl: `https://alibaba.com/product/${id}`,
  } as ProductData
}
