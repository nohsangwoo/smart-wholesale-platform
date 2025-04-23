import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <Image src="/vibrant-shopping-cart.png" alt="스마트 도소매 플랫폼 로고" fill className="object-contain" />
      </div>
      <h1 className="text-2xl font-bold">스마트 도소매</h1>
    </Link>
  )
}
