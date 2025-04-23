"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SharedItem {
  id: string
  title: string
  url: string
  platform: string
  sharedAt: string
  sharedTo?: string
}

interface ShareContextType {
  sharedItems: SharedItem[]
  addSharedItem: (item: Omit<SharedItem, "sharedAt">) => void
  removeSharedItem: (id: string) => void
  clearSharedItems: () => void
}

const ShareContext = createContext<ShareContextType | undefined>(undefined)

export function ShareProvider({ children }: { children: ReactNode }) {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([])

  // 로컬 스토리지에서 공유 내역 불러오기
  useEffect(() => {
    const storedItems = localStorage.getItem("sharedItems")
    if (storedItems) {
      try {
        setSharedItems(JSON.parse(storedItems))
      } catch (error) {
        console.error("공유 내역 파싱 오류:", error)
        localStorage.removeItem("sharedItems")
      }
    }
  }, [])

  // 공유 내역 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("sharedItems", JSON.stringify(sharedItems))
  }, [sharedItems])

  const addSharedItem = (item: Omit<SharedItem, "sharedAt">) => {
    const newItem = {
      ...item,
      sharedAt: new Date().toISOString(),
    }

    setSharedItems((prev) => [newItem, ...prev])
  }

  const removeSharedItem = (id: string) => {
    setSharedItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearSharedItems = () => {
    setSharedItems([])
  }

  return (
    <ShareContext.Provider
      value={{
        sharedItems,
        addSharedItem,
        removeSharedItem,
        clearSharedItems,
      }}
    >
      {children}
    </ShareContext.Provider>
  )
}

export function useShare() {
  const context = useContext(ShareContext)
  if (context === undefined) {
    throw new Error("useShare must be used within a ShareProvider")
  }
  return context
}
