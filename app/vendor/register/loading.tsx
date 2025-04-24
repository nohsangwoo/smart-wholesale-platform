import { Skeleton } from "@/components/ui/skeleton"

export default function VendorRegisterLoading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-[300px] mx-auto mb-2" />
          <Skeleton className="h-5 w-[500px] mx-auto" />
        </div>

        <div className="border rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-[200px]" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>

          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
