import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { ShareProvider } from "@/context/share-context"
import { Header } from "@/components/header"
import { ChatFloatingButton } from "@/components/chat/chat-floating-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "스마트 도소매 플랫폼",
  description: "해외 상품 분석 및 구매 대행 서비스",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <WishlistProvider>
              <ShareProvider>
                <Header />
                {children}
                <ChatFloatingButton />
              </ShareProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
