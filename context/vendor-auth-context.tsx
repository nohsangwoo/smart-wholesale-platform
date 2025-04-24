"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface VendorUser {
  id: string
  name: string
  email: string
  companyName: string
  profileImage?: string
  rating?: number
  reviewCount?: number
}

interface VendorAuthContextType {
  user: VendorUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined)

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VendorUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 판매자 정보 확인
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("vendorUser")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // 테스트용 로그인 로직 (실제로는 API 호출)
      if (email === "vendor@example.com" && password === "password123") {
        const mockUser: VendorUser = {
          id: "vendor-1",
          name: "홍길동",
          email: "vendor@example.com",
          companyName: "스마트 도매 솔루션",
          profileImage: "/abstract-blue-logo.png",
          rating: 4.8,
          reviewCount: 156,
        }

        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem("vendorUser", JSON.stringify(mockUser))
        return true
      }

      // 실제 API 호출 (현재는 모의 구현)
      /*
      const response = await fetch("/api/vendor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("vendorUser", JSON.stringify(data.user))
        return true
      }
      */

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("vendorUser")
  }

  return (
    <VendorAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  )
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext)
  if (context === undefined) {
    throw new Error("useVendorAuth must be used within a VendorAuthProvider")
  }
  return context
}
