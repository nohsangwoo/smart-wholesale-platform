import type React from "react"
import { VendorAuthProvider } from "@/context/vendor-auth-context"
import { Toaster } from "@/components/ui/toaster"

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <VendorAuthProvider>
      {children}
      <Toaster />
    </VendorAuthProvider>
  )
}
