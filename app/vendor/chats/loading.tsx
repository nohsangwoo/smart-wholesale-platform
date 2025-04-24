import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-48 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* 채팅 목록 스켈레톤 */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white">
          <div className="p-3 border-b">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="divide-y">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 채팅 내용 스켈레톤 */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden bg-white flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    <div className="max-w-[70%]">
                      <Skeleton className={`h-12 w-64 rounded-lg`} />
                      <div className={`mt-1 flex items-center gap-1 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
