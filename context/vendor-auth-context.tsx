"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface VendorUser {
  id: string
  email: string
  name: string
  companyName: string
  profileImage: string
  rating: number
  reviewCount: number
  verified: boolean
  premium: boolean
}

interface VendorAuthContextType {
  vendor: VendorUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined)

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<VendorUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 업체 정보 불러오기
    const storedVendor = localStorage.getItem("vendor")
    if (storedVendor) {
      setVendor(JSON.parse(storedVendor))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // 모킹된 API 호출
      const response = await fetch("/api/vendor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setVendor(data.vendor)
        localStorage.setItem("vendor", JSON.stringify(data.vendor))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Vendor login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setVendor(null)
    localStorage.removeItem("vendor")
  }

  return (
    <VendorAuthContext.Provider
      value={{
        vendor,
        isLoading,
        login,
        logout,
        isAuthenticated: !!vendor,
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
