"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

// 알림 타입 정의
interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: "quote" | "order" | "chat" | "system"
  link?: string
}

export function NotificationMenu() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  // 모킹된 알림 데이터 생성
  useEffect(() => {
    if (isAuthenticated) {
      const mockNotifications: Notification[] = [
        {
          id: "notif-1",
          title: "새로운 견적 제안",
          message: "LED 스마트 조명에 대한 새로운 견적 제안이 도착했습니다.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
          read: false,
          type: "quote",
          link: "/mypage/quotes",
        },
        {
          id: "notif-2",
          title: "주문 상태 업데이트",
          message: "주문 #order-2의 상태가 '배송 중'으로 변경되었습니다.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
          read: false,
          type: "order",
          link: "/mypage/orders/order-2",
        },
        {
          id: "notif-3",
          title: "새 메시지",
          message: "키키퍼 로지스틱스에서 새 메시지가 도착했습니다.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
          read: true,
          type: "chat",
          link: "/vendor/chats",
        },
        {
          id: "notif-4",
          title: "견적 요청 마감 임박",
          message: "스마트폰 케이스 견적 요청이 24시간 내에 마감됩니다.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          read: true,
          type: "quote",
          link: "/mypage/quotes",
        },
        {
          id: "notif-5",
          title: "시스템 공지",
          message: "서비스 점검 안내: 5월 15일 오전 2시부터 4시까지 서비스 이용이 제한됩니다.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2일 전
          read: true,
          type: "system",
        },
      ]

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
    }
  }, [isAuthenticated])

  // 알림 읽음 처리
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    setUnreadCount(0)
  }

  // 알림 클릭 처리
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setOpen(false)
    if (notification.link) {
      router.push(notification.link)
    }
  }

  if (!isAuthenticated) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">알림</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">알림</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
              모두 읽음 표시
            </Button>
          )}
        </div>
        <Tabs defaultValue="all">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="flex-1 rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              전체
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex-1 rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              안 읽음 ({unreadCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`cursor-pointer p-3 hover:bg-muted ${!notification.read ? "bg-muted/50" : ""}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between">
                        <h5 className="font-medium">{notification.title}</h5>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                      {!notification.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-4">
                  <p className="text-center text-sm text-muted-foreground">알림이 없습니다</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.filter((n) => !n.read).length > 0 ? (
                <div className="divide-y">
                  {notifications
                    .filter((notification) => !notification.read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="cursor-pointer bg-muted/50 p-3 hover:bg-muted"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between">
                          <h5 className="font-medium">{notification.title}</h5>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-4">
                  <p className="text-center text-sm text-muted-foreground">읽지 않은 알림이 없습니다</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

// 타임스탬프 포맷팅 함수
function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return "방금 전"
  } else if (diffMin < 60) {
    return `${diffMin}분 전`
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`
  } else if (diffDay < 7) {
    return `${diffDay}일 전`
  } else {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  }
}
