import { SearchForm } from "@/components/search-form"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        <Logo />
        <SearchForm />
        <p className="text-sm text-muted-foreground text-center mt-8">
          해외 쇼핑몰 링크를 입력하여 상품 분석 및 구매 대행 서비스를 이용해보세요.
          <br />
          지원 플랫폼: Alibaba, Taobao, 1688 등
        </p>
      </div>
    </main>
  )
}
