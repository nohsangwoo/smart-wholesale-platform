import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalysisLoading() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">상품을 분석 중입니다...</h2>
        <p className="text-muted-foreground text-center">
          AI 기반으로 수수료 및 마진을 계산 중입니다
          <br />
          잠시만 기다려주세요
        </p>
      </div>

      <div className="border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-64 w-full md:w-1/3 rounded-md" />
          <div className="w-full md:w-2/3 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <div className="pt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
