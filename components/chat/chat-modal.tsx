"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, Paperclip, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isUser: boolean
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  vendorId?: string
  vendorName?: string
  vendorAvatar?: string
}

export function ChatModal({ isOpen, onClose, vendorId, vendorName, vendorAvatar }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 모달이 열릴 때 초기 메시지 로드
  useEffect(() => {
    if (isOpen && vendorId) {
      loadInitialMessages()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen, vendorId])

  // 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadInitialMessages = () => {
    // 모의 초기 메시지 로드
    const initialMessages: ChatMessage[] = []

    // 업체가 있는 경우 환영 메시지 추가
    if (vendorId) {
      initialMessages.push({
        id: `welcome-${Date.now()}`,
        senderId: vendorId,
        senderName: vendorName || "업체 담당자",
        senderAvatar: vendorAvatar,
        content: `안녕하세요! ${vendorName || "업체"} 담당자입니다. 어떤 도움이 필요하신가요?`,
        timestamp: new Date(),
        isUser: false,
      })
    }

    setMessages(initialMessages)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      senderId: "user",
      senderName: "나",
      content: newMessage,
      timestamp: new Date(),
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsLoading(true)

    // 업체 응답 시뮬레이션 (1~2초 후)
    setTimeout(
      () => {
        const vendorResponse: ChatMessage = {
          id: `vendor-${Date.now()}`,
          senderId: vendorId || "vendor",
          senderName: vendorName || "업체 담당자",
          senderAvatar: vendorAvatar,
          content: getAutoResponse(newMessage),
          timestamp: new Date(),
          isUser: false,
        }

        setMessages((prev) => [...prev, vendorResponse])
        setIsLoading(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  // 자동 응답 생성 함수
  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("안녕") || lowerMessage.includes("hello")) {
      return "안녕하세요! 무엇을 도와드릴까요?"
    } else if (lowerMessage.includes("가격") || lowerMessage.includes("할인")) {
      return "현재 저희 견적에서 제시해 드린 가격이 최선의 조건입니다. 대량 주문의 경우 추가 할인이 가능할 수 있으니 자세한 내용을 알려주시면 검토해 보겠습니다."
    } else if (lowerMessage.includes("배송") || lowerMessage.includes("도착")) {
      return "일반적으로 결제 완료 후 5~7일 내에 배송이 시작됩니다. 통관 과정에 따라 약간의 지연이 있을 수 있습니다."
    } else if (lowerMessage.includes("품질") || lowerMessage.includes("보증")) {
      return "저희는 모든 제품에 대해 품질 보증을 제공합니다. 제품 수령 후 문제가 있으시면 즉시 연락 주시기 바랍니다."
    } else if (lowerMessage.includes("문의") || lowerMessage.includes("질문")) {
      return "네, 어떤 문의사항이 있으신가요? 자세히 알려주시면 도움드리겠습니다."
    } else {
      return "문의 주셔서 감사합니다. 확인 후 빠르게 답변 드리겠습니다. 추가 질문이 있으시면 언제든지 말씀해 주세요."
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md h-[600px] max-h-[90vh] flex flex-col">
        {/* 채팅 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {vendorAvatar ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={vendorAvatar || "/placeholder.svg"} alt={vendorName || "업체"} />
                <AvatarFallback>{vendorName?.[0] || "V"}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarFallback>{vendorName?.[0] || "V"}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="font-medium">{vendorName || "업체 담당자"}</h3>
              <Badge variant="outline" className="text-xs">
                온라인
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 채팅 내용 */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"} gap-2 items-end`}
              >
                {!message.isUser && (
                  <Avatar className="h-8 w-8">
                    {message.senderAvatar ? (
                      <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
                    ) : null}
                    <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2 items-end">
                <Avatar className="h-8 w-8">
                  {vendorAvatar ? (
                    <AvatarImage src={vendorAvatar || "/placeholder.svg"} alt={vendorName || "업체"} />
                  ) : null}
                  <AvatarFallback>{vendorName?.[0] || "V"}</AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground max-w-[80%] rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* 메시지 입력 */}
        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="flex-shrink-0" disabled={!newMessage.trim() || isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
