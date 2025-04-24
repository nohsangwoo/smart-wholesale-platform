"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ChatPreview {
  id: string
  vendorId: string
  vendorName: string
  vendorAvatar?: string
  lastMessage: string
  timestamp: Date
  unread: number
}

interface ChatListProps {
  isOpen: boolean
  onClose: () => void
  onSelectChat: (vendor: { id: string; name: string; avatar?: string }) => void
}

export function ChatList({ isOpen, onClose, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isOpen) {
      // 모의 채팅 목록 로드
      const mockChats: ChatPreview[] = [
        {
          id: "chat-1",
          vendorId: "vendor-1",
          vendorName: "스마트텍",
          vendorAvatar: "/abstract-blue-swirl.png",
          lastMessage: "네, 주문하신 상품은 내일 출고될 예정입니다.",
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
          unread: 1,
        },
        {
          id: "chat-2",
          vendorId: "vendor-2",
          vendorName: "글로벌옵션",
          vendorAvatar: "/abstract-green-swirl.png",
          lastMessage: "안녕하세요! 어떤 도움이 필요하신가요?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
          unread: 0,
        },
        {
          id: "chat-3",
          vendorId: "vendor-3",
          vendorName: "이젠로지스틱",
          vendorAvatar: "/abstract-red-swirl.png",
          lastMessage: "견적서를 검토해 주셔서 감사합니다. 추가 질문이 있으시면 언제든지 문의해 주세요.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
          unread: 0,
        },
        {
          id: "chat-4",
          vendorId: "vendor-4",
          vendorName: "대한민국특송물류",
          vendorAvatar: "/stylized-korean-elements.png",
          lastMessage: "배송 관련 문의 주셔서 감사합니다. 현재 통관 절차가 진행 중입니다.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          unread: 2,
        },
      ]

      setChats(mockChats)
    }
  }, [isOpen])

  const filteredChats = chats.filter((chat) => chat.vendorName.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return `${diffDays}일 전`
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours > 0) {
      return `${diffHours}시간 전`
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    if (diffMinutes > 0) {
      return `${diffMinutes}분 전`
    }

    return "방금 전"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md h-[600px] max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">채팅 목록</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 검색 */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="업체 이름으로 검색"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 채팅 목록 */}
        <ScrollArea className="flex-1">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-muted-foreground">채팅 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() =>
                    onSelectChat({
                      id: chat.vendorId,
                      name: chat.vendorName,
                      avatar: chat.vendorAvatar,
                    })
                  }
                >
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      {chat.vendorAvatar ? (
                        <AvatarImage src={chat.vendorAvatar || "/placeholder.svg"} alt={chat.vendorName} />
                      ) : null}
                      <AvatarFallback>{chat.vendorName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium truncate">{chat.vendorName}</h3>
                        <span className="text-xs text-muted-foreground">{formatTime(chat.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
