"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Ship } from "lucide-react"
import { useRouter } from "next/navigation"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const router = useRouter()

  const handleBuyerSignup = () => {
    router.push("/signup/buyer")
    onClose()
  }

  const handleSellerSignup = () => {
    router.push("/vendor/register")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">회원가입</DialogTitle>
          <DialogDescription className="text-center">가입하실 회원 유형을 선택해주세요.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-6">
          <Button
            onClick={handleBuyerSignup}
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-3 bg-red-100 hover:bg-red-200 border-red-200"
          >
            <ShoppingCart className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">쇼핑카트 아이콘</p>
              <p className="text-lg font-medium">구매자</p>
            </div>
          </Button>
          <Button
            onClick={handleSellerSignup}
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-3 bg-orange-100 hover:bg-orange-200 border-orange-200"
          >
            <Ship className="h-12 w-12 text-orange-500" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">선박이나 비행기 아이콘</p>
              <p className="text-lg font-medium">판매자</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
