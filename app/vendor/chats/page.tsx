"use client"

import { useState, useEffect } from "react"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// 채팅 데이터 타입 정의
type Message = {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
}

type Chat = {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  messages: Message[]
}

// 임시 채팅 데이터
const mockChats: Chat[] = [
  {
    id: "chat1",
    userId: "user1",
    userName: "김고객",
    userAvatar: "/mystical-forest-spirit.png",
    lastMessage: "견적 가격이 얼마인가요?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
    unreadCount: 2,
    messages: [
      {
        id: "msg1",
        senderId: "user1",
        content: "안녕하세요, 스마트폰 케이스 대량 구매 관련 문의드립니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
        read: true,
      },
      {
        id: "msg2",
        senderId: "vendor1",
        content: "네, 안녕하세요. 어떤 모델을 찾으시나요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25분 전
        read: true,
      },
      {
        id: "msg3",
        senderId: "user1",
        content: "아이폰 14 모델 케이스 500개 정도 필요합니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20분 전
        read: true,
      },
      {
        id: "msg4",
        senderId: "vendor1",
        content: "네, 가능합니다. 디자인은 어떤 것을 원하시나요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
        read: true,
      },
      {
        id: "msg5",
        senderId: "user1",
        content: "심플한 디자인으로 투명 케이스와 블랙 케이스 반반씩 필요합니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10분 전
        read: true,
      },
      {
        id: "msg6",
        senderId: "user1",
        content: "견적 가격이 얼마인가요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
        read: false,
      },
    ],
  },
  {
    id: "chat2",
    userId: "user2",
    userName: "이구매자",
    userAvatar: "/diverse-group-city.png",
    lastMessage: "배송은 언제 가능한가요?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    unreadCount: 0,
    messages: [
      {
        id: "msg1",
        senderId: "user2",
        content: "안녕하세요, 티셔츠 대량 구매 관련 문의드립니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
        read: true,
      },
      {
        id: "msg2",
        senderId: "vendor1",
        content: "네, 안녕하세요. 어떤 종류의 티셔츠를 찾으시나요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55분 전
        read: true,
      },
      {
        id: "msg3",
        senderId: "user2",
        content: "면 티셔츠 300장 정도 필요합니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50분 전
        read: true,
      },
      {
        id: "msg4",
        senderId: "vendor1",
        content: "네, 가능합니다. 사이즈 구성은 어떻게 되나요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45분 전
        read: true,
      },
      {
        id: "msg5",
        senderId: "user2",
        content: "S, M, L, XL 사이즈 각각 75장씩 필요합니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40분 전
        read: true,
      },
      {
        id: "msg6",
        senderId: "user2",
        content: "배송은 언제 가능한가요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
        read: true,
      },
    ],
  },
  {
    id: "chat3",
    userId: "user3",
    userName: "박바이어",
    userAvatar: "/diverse-shoppers-market.png",
    lastMessage: "샘플 먼저 받아볼 수 있을까요?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    unreadCount: 1,
    messages: [
      {
        id: "msg1",
        senderId: "user3",
        content: "안녕하세요, LED 조명 관련 문의드립니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
        read: true,
      },
      {
        id: "msg2",
        senderId: "vendor1",
        content: "네, 안녕하세요. 어떤 종류의 LED 조명을 찾으시나요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.9), // 2.9시간 전
        read: true,
      },
      {
        id: "msg3",
        senderId: "user3",
        content: "실내용 LED 스트립 조명 100m 정도 필요합니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.8), // 2.8시간 전
        read: true,
      },
      {
        id: "msg4",
        senderId: "vendor1",
        content: "네, 가능합니다. 색상은 어떤 것을 원하시나요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.7), // 2.7시간 전
        read: true,
      },
      {
        id: "msg5",
        senderId: "user3",
        content: "웜화이트와 쿨화이트 두 가지로 각각 50m씩 필요합니다.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5시간 전
        read: true,
      },
      {
        id: "msg6",
        senderId: "user3",
        content: "샘플 먼저 받아볼 수 있을까요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
        read: false,
      },
    ],
  },
]

export default function VendorChatsPage() {
  const { user } = useVendorAuth()
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // 실제 구현에서는 API에서 채팅 데이터를 가져옵니다
    if (chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0])
    }
  }, [chats, selectedChat])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "오늘"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제"
    } else {
      return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat.id) {
        const newMsg: Message = {
          id: `msg${Date.now()}`,
          senderId: "vendor1", // 판매자 ID
          content: newMessage,
          timestamp: new Date(),
          read: true,
        }

        return {
          ...chat,
          lastMessage: newMessage,
          lastMessageTime: new Date(),
          messages: [...chat.messages, newMsg],
        }
      }
      return chat
    })

    setChats(updatedChats)
    setSelectedChat(updatedChats.find((chat) => chat.id === selectedChat.id) || null)
    setNewMessage("")
  }

  const handleChatSelect = (chat: Chat) => {
    // 읽음 처리
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return {
          ...c,
          unreadCount: 0,
          messages: c.messages.map((msg) => ({ ...msg, read: true })),
        }
      }
      return c
    })

    setChats(updatedChats)
    setSelectedChat(updatedChats.find((c) => c.id === chat.id) || null)
  }

  const filteredChats = chats.filter((chat) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return chat.unreadCount > 0
    return false
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">채팅</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* 채팅 목록 */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white">
          <div className="p-3 border-b">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="unread">안 읽은 메시지</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="divide-y">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedChat?.id === chat.id ? "bg-gray-50" : ""}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={chat.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{chat.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{chat.userName}</span>
                        <span className="text-xs text-gray-500">{formatDate(chat.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="rounded-full h-5 min-w-5 flex items-center justify-center"
                      >
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 채팅 내용 */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden bg-white flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-3 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedChat.userAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedChat.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedChat.userName}</h3>
                    <p className="text-xs text-gray-500">최근 접속: 방금 전</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedChat.messages.map((message, index) => {
                    const isVendor = message.senderId === "vendor1"
                    const showDate =
                      index === 0 ||
                      new Date(selectedChat.messages[index - 1].timestamp).toDateString() !==
                        new Date(message.timestamp).toDateString()

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isVendor ? "justify-end" : "justify-start"}`}>
                          <div className="max-w-[70%]">
                            <div className={`p-3 rounded-lg ${isVendor ? "bg-primary text-white" : "bg-gray-100"}`}>
                              {message.content}
                            </div>
                            <div
                              className={`text-xs mt-1 flex items-center gap-1 ${isVendor ? "justify-end" : "justify-start"}`}
                            >
                              <span>{formatTime(message.timestamp)}</span>
                              {isVendor && <span className="text-gray-500">{message.read ? "읽음" : "안 읽음"}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">채팅을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
