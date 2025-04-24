import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-48 mb-6" />

      {/* 필터 및 검색 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* 정렬 옵션 스켈레톤 */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-[200px]" />
      </div>

      {/* 견적 요청 목록 스켈레톤 */}
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                {/* 기본 정보 스켈레톤 */}
                <div className="p-4 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-5 w-full mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>

                {/* 상세 정보 스켈레톤 */}
                <div className="p-4">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <div key={j} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* 액션 버튼 스켈레톤 */}
                <div className="p-4 flex flex-col justify-center">
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
