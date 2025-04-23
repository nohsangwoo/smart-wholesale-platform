"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Share2, Trash2, ExternalLink, Copy, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { useShare } from "@/context/share-context"
import { useToast } from "@/hooks/use-toast"

export default function SharedItemsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { sharedItems, removeSharedItem, clearSharedItems } = useShare()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/mypage/shared")
    }
  }, [isAuthenticated, isLoading, router])

  const handleRemoveItem = (id: string) => {
    removeSharedItem(id)
    toast({
      title: "공유 내역이 제거되었습니다",
      description: "공유 내역에서 항목이 제거되었습니다.",
    })
  }

  const handleClearSharedItems = () => {
    if (sharedItems.length === 0) return

    clearSharedItems()
    toast({
      title: "공유 내역이 비워졌습니다",
      description: "모든 항목이 공유 내역에서 제거되었습니다.",
    })
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "링크가 복사되었습니다",
      description: "원하는 곳에 붙여넣기 하세요",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          <span className="text-sm">공유 내역</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">공유 내역</h1>
          {sharedItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearSharedItems}>
              <Trash2 className="h-4 w-4 mr-2" />
              전체 삭제
            </Button>
          )}
        </div>

        {sharedItems.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Share2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">공유 내역이 없습니다.</p>
            <Button variant="link" onClick={() => router.push("/")}>
              상품 둘러보기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sharedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.title}</h3>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">삭제</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">출처: {item.platform}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>공유일: {formatDate(item.sharedAt)}</span>
                    </div>
                    <div className="flex items-center mt-2 gap-2">
                      <div className="flex-1 bg-muted p-2 rounded text-sm truncate">{item.url}</div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => handleCopyLink(item.url)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">복사</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => window.open(item.url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">열기</span>
                      </Button>
                    </div>
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
