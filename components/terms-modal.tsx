"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: string
  onAgree: () => void
}

export function TermsModal({ open, onOpenChange, title, content, onAgree }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>아래 내용을 확인하시고 동의해주세요.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto border rounded-md p-4 my-4">
          <div className="prose prose-sm">
            <p className="whitespace-pre-line">{content}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={onAgree}>동의합니다</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
