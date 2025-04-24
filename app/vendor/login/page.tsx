"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVendorAuth } from "@/context/vendor-auth-context"
import { useToast } from "@/hooks/use-toast"
import { Shield, Lock } from "lucide-react"

export default function VendorLoginPage() {
  const [email, setEmail] = useState("vendor@example.com")
  const [password, setPassword] = useState("vendor123!")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useVendorAuth()
  const router = useRouter()
  const { toast } = useToast()

  // 이미 로그인되어 있으면 대시보드로 리다이렉트
  if (isAuthenticated) {
    router.push("/vendor/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        toast({
          title: "로그인 성공",
          description: "업체 대시보드로 이동합니다.",
        })
        router.push("/vendor/dashboard")
      } else {
        toast({
          title: "로그인 실패",
          description: "이메일 또는 비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "로그인 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">업체 로그인</CardTitle>
          <CardDescription className="text-center">스마트 도소매 플랫폼 업체 페이지에 로그인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="업체 이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-xs text-muted-foreground">테스트 계정: vendor@example.com / vendor123!</div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
              <Lock className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" size="sm" onClick={() => router.push("/")}>
              메인 페이지로 돌아가기
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div className="flex -space-x-2">
              {["/abstract-blue-swirl.png", "/abstract-green-swirl.png", "/abstract-red-swirl.png"].map((src, i) => (
                <div key={i} className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                  <Image src={src || "/placeholder.svg"} alt="업체 로고" fill className="object-cover" />
                </div>
              ))}
            </div>
            <span className="ml-3 text-sm text-muted-foreground">300+ 업체가 이용 중입니다</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
