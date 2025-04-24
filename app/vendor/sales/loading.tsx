import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Skeleton className="h-8 w-48" />

        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[240px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      {/* 요약 카드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-8 w-36 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
      </div>

      {/* 차트 스켈레톤 */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
        </div>

        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="border rounded-lg p-4">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="text-right py-3 px-4">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </th>
                <th className="text-right py-3 px-4">
                  <Skeleton className="h-4 w-20 ml-auto" />
                </th>
                <th className="text-right py-3 px-4">
                  <Skeleton className="h-4 w-24 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="text-right py-3 px-4">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </td>
                    <td className="text-right py-3 px-4">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </td>
                    <td className="text-right py-3 px-4">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
