"use client"

import { useState } from "react"
import { Check, Copy, Facebook, Twitter, Link2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
}

export function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    toast({
      title: "링크가 복사되었습니다",
      description: "원하는 곳에 붙여넣기 하세요",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${url}`)}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>공유하기</DialogTitle>
          <DialogDescription>이 상품을 다른 사람들과 공유해보세요</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <Input value={url} readOnly className="flex-1" />
          <Button size="icon" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            <span className="sr-only">Facebook에 공유</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="h-5 w-5 text-sky-500" />
            <span className="sr-only">Twitter에 공유</span>
          </Button>

          <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={() => handleShare("email")}>
            <Mail className="h-5 w-5 text-green-600" />
            <span className="sr-only">이메일로 공유</span>
          </Button>

          <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={handleCopyLink}>
            <Link2 className="h-5 w-5 text-purple-600" />
            <span className="sr-only">링크 복사</span>
          </Button>
        </div>

        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full">
            닫기
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
