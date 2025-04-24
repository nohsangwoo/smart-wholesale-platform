import { Skeleton } from "@/components/ui/skeleton"

export default function AdminVendorsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="flex items-center gap-4 py-3 border-b">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[80px]" />
            <Skeleton className="h-5 w-[80px]" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[50px] ml-auto" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b last:border-0">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
