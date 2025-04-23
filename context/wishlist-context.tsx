"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ProductData } from "@/lib/types"

interface WishlistContextType {
  wishlist: ProductData[]
  addToWishlist: (product: ProductData) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductData[]>([])

  // 로컬 스토리지에서 위시리스트 불러오기
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("위시리스트 파싱 오류:", error)
        localStorage.removeItem("wishlist")
      }
    }
  }, [])

  // 위시리스트 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product: ProductData) => {
    setWishlist((prev) => {
      // 이미 존재하는 상품인지 확인
      if (prev.some((item) => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
