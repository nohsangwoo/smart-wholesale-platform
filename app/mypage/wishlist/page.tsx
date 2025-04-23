"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart, ShoppingCart, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { useWishlist } from "@/context/wishlist-context"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/mypage/wishlist")
    }
  }, [isAuthenticated, isLoading, router])

  const handleRemoveItem = (productId: string) => {
    removeFromWishlist(productId)
    toast({
      title: "상품이 제거되었습니다",
      description: "찜 목록에서 상품이 제거되었습니다.",
    })
  }

  const handleClearWishlist = () => {
    if (wishlist.length === 0) return

    clearWishlist()
    toast({
      title: "찜 목록이 비워졌습니다",
      description: "모든 상품이 찜 목록에서 제거되었습니다.",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/mypage" className="text-sm text-muted-foreground hover:text-foreground">
            내 정보
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">찜한 상품</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">찜한 상품</h1>
          {wishlist.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearWishlist}>
              <Trash2 className="h-4 w-4 mr-2" />
              전체 삭제
            </Button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">찜한 상품이 없습니다.</p>
            <Button variant="link" onClick={() => router.push("/")}>
              상품 둘러보기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">출처: {product.platform}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()}원
                        </p>
                        <p className="text-primary font-semibold">{product.estimatedPrice.toLocaleString()}원</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveItem(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">삭제</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => router.push(`/analysis?url=${encodeURIComponent(product.originalUrl || "")}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">상세보기</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" onClick={() => router.push(`/purchase?productId=${product.id}`)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      구매 대행 신청
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
