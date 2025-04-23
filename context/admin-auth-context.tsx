"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
}

interface AdminAuthContextType {
  admin: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 관리자 정보 불러오기
    const storedAdmin = localStorage.getItem("admin")
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // 모킹된 API 호출
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setAdmin(data.admin)
        localStorage.setItem("admin", JSON.stringify(data.admin))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
