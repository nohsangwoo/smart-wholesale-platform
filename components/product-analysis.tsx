"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { ProductData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Heart, Share2, MessageCircle } from "lucide-react"
import { LoginModal } from "@/components/auth/login-modal"
import { ShareModal } from "@/components/share-modal"
import { useAuth } from "@/context/auth-context"
import { useWishlist } from "@/context/wishlist-context"
import { useShare } from "@/context/share-context"
import { useToast } from "@/hooks/use-toast"

interface ProductAnalysisProps {
  product: ProductData
}

export function ProductAnalysis({ product }: ProductAnalysisProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addSharedItem } = useShare()
  const { toast } = useToast()
  const router = useRouter()

  const handlePurchaseClick = () => {
    if (isAuthenticated) {
      // 로그인 상태면 구매 페이지로 이동
      router.push(`/purchase?productId=${product.id}`)
    } else {
      // 비로그인 상태면 로그인 모달 표시
      setIsLoginModalOpen(true)
    }
  }

  const handleInquiryClick = () => {
    if (isAuthenticated) {
      // 로그인 상태면 문의 페이지로 이동
      router.push(`/inquiry?productId=${product.id}&type=product`)
    } else {
      // 비로그인 상태면 로그인 모달 표시
      setIsLoginModalOpen(true)
    }
  }

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }

    const isAlreadyInWishlist = isInWishlist(product.id)

    if (isAlreadyInWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "찜 목록에서 제거되었습니다",
        description: "상품이 찜 목록에서 제거되었습니다.",
      })
    } else {
      addToWishlist(product)
      toast({
        title: "찜 목록에 추가되었습니다",
        description: "상품이 찜 목록에 추가되었습니다.",
      })
    }
  }

  const handleShareClick = () => {
    setIsShareModalOpen(true)

    // 공유 내역에 추가
    if (isAuthenticated) {
      addSharedItem({
        id: `share-${product.id}-${Date.now()}`,
        title: product.title,
        url: `${typeof window !== "undefined" ? window.location.origin : ""}/analysis?url=${encodeURIComponent(product.originalUrl || "")}`,
        platform: product.platform,
      })
    }
  }

  const productInWishlist = isInWishlist(product.id)

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">상품 분석 결과</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-64 w-full md:w-1/3 rounded-md overflow-hidden">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=400&width=400&query=product"}
                alt={product.title}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to placeholder if the image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = "/assorted-products-display.png"
                }}
              />
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-muted-foreground mb-4">출처: {product.platform}</p>

              <div className="flex items-center gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">원래 가격</p>
                  <p className="text-lg line-through">{product.originalPrice}원</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">예상 구매 대행 가격</p>
                  <p className="text-2xl font-bold text-primary">{product.estimatedPrice}원</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>수수료</span>
                  <span>{product.fees}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>관세</span>
                  <span>{product.tax}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>배송비</span>
                  <span>{product.shippingCost}원</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button className="w-full py-6 text-lg" size="lg" onClick={handlePurchaseClick}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          구매 대행 요청
        </Button>

        <div className="flex gap-4">
          <Button
            variant={productInWishlist ? "default" : "outline"}
            className={`flex-1 ${productInWishlist ? "bg-pink-600 hover:bg-pink-700" : ""}`}
            onClick={handleWishlistClick}
          >
            <Heart className={`mr-2 h-5 w-5 ${productInWishlist ? "fill-current" : ""}`} />
            {productInWishlist ? "찜 완료" : "찜하기"}
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleShareClick}>
            <Share2 className="mr-2 h-5 w-5" />
            공유하기
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleInquiryClick}>
            <MessageCircle className="mr-2 h-5 w-5" />
            문의하기
          </Button>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectUrl={`/purchase?productId=${product.id}`}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={product.title}
        url={`${typeof window !== "undefined" ? window.location.origin : ""}/analysis?url=${encodeURIComponent(product.originalUrl || "")}`}
      />
    </div>
  )
}
