"use client"

import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatModal } from "@/components/chat/chat-modal"
import { ChatList } from "@/components/chat/chat-list"

export function ChatFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [isChatListOpen, setIsChatListOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<{
    id: string
    name: string
    avatar?: string
  } | null>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setIsChatListOpen(false)
    }
  }

  const handleOpenChat = (vendor?: { id: string; name: string; avatar?: string }) => {
    if (vendor) {
      setSelectedVendor(vendor)
    }
    setIsChatModalOpen(true)
    setIsOpen(false)
    setIsChatListOpen(false)
  }

  const handleOpenChatList = () => {
    setIsChatListOpen(true)
    setIsOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
        {/* 채팅 목록 버튼 (메뉴가 열렸을 때만 표시) */}
        {isOpen && (
          <Button onClick={handleOpenChatList} className="rounded-full shadow-lg animate-fadeIn" size="sm">
            채팅 목록 보기
          </Button>
        )}

        {/* 새 채팅 버튼 (메뉴가 열렸을 때만 표시) */}
        {isOpen && (
          <Button onClick={() => handleOpenChat()} className="rounded-full shadow-lg animate-fadeIn" size="sm">
            새 채팅 시작하기
          </Button>
        )}

        {/* 메인 플로팅 버튼 */}
        <Button onClick={toggleMenu} className="rounded-full h-14 w-14 shadow-lg" size="icon">
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={selectedVendor?.id}
        vendorName={selectedVendor?.name}
        vendorAvatar={selectedVendor?.avatar}
      />

      {/* 채팅 목록 모달 */}
      <ChatList isOpen={isChatListOpen} onClose={() => setIsChatListOpen(false)} onSelectChat={handleOpenChat} />
    </>
  )
}
