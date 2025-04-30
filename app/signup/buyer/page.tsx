"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { User, Building2 } from "lucide-react"
import { TermsModal } from "@/components/terms-modal"

// 폼 스키마 정의
const formSchema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    confirmPassword: z.string(),
    phone: z.string().min(10, "전화번호는 10자리 이상이어야 합니다."),
    address: z.string().min(5, "주소는 5자 이상이어야 합니다."),
    detailAddress: z.string().optional(),
    // 회사 정보는 선택 사항
    companyName: z.string().optional(),
    businessNumber: z.string().optional(),
    termsAgreed: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해주세요.",
    }),
    privacyAgreed: z.boolean().refine((val) => val === true, {
      message: "개인정보 처리방침에 동의해주세요.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

export default function BuyerSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [showCompanyInfo, setShowCompanyInfo] = useState(false)

  // 폼 초기화
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      detailAddress: "",
      companyName: "",
      businessNumber: "",
      termsAgreed: false,
      privacyAgreed: false,
    },
  })

  // 폼 제출 처리
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // 여기서 실제 API 호출을 수행할 수 있습니다.
      // 현재는 모킹된 응답을 사용합니다.
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "회원가입이 완료되었습니다",
        description: "로그인 페이지로 이동합니다.",
      })

      // 로그인 페이지로 리다이렉트
      router.push("/login")
    } catch (error) {
      console.error("Error submitting signup:", error)
      toast({
        title: "회원가입 중 오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">구매자 회원가입</h1>
          <p className="text-muted-foreground">스마트 도소매 플랫폼에 가입하여 다양한 서비스를 이용해보세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>구매자 정보 입력</CardTitle>
            <CardDescription>회원가입을 위해 아래 정보를 입력해주세요. *표시는 필수 입력 항목입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    기본 정보
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름 *</FormLabel>
                          <FormControl>
                            <Input placeholder="이름을 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일 *</FormLabel>
                          <FormControl>
                            <Input placeholder="example@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호 *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
                          </FormControl>
                          <FormDescription>6자 이상 입력해주세요.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호 확인 *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="비밀번호를 다시 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연락처 *</FormLabel>
                        <FormControl>
                          <Input placeholder="010-0000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>주소 *</FormLabel>
                          <FormControl>
                            <Input placeholder="주소를 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="detailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상세 주소</FormLabel>
                          <FormControl>
                            <Input placeholder="상세 주소를 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCompanyInfo(!showCompanyInfo)}
                    className="w-full"
                  >
                    {showCompanyInfo ? "회사 정보 숨기기" : "회사 정보 입력하기 (선택)"}
                  </Button>
                </div>

                {showCompanyInfo && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Building2 className="mr-2 h-5 w-5" />
                      회사 정보 (선택)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>회사명</FormLabel>
                            <FormControl>
                              <Input placeholder="회사명을 입력하세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>사업자등록번호</FormLabel>
                            <FormControl>
                              <Input placeholder="000-00-00000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4 mt-6">
                  <FormField
                    control={form.control}
                    name="termsAgreed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            <span
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => setTermsModalOpen(true)}
                            >
                              이용약관
                            </span>
                            에 동의합니다 *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacyAgreed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            <span
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => setPrivacyModalOpen(true)}
                            >
                              개인정보 처리방침
                            </span>
                            에 동의합니다 *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "가입 중..." : "회원가입"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
            <p>* 표시된 항목은 필수 입력 사항입니다.</p>
            <p>회사 정보는 선택 사항이며, 입력하지 않아도 회원가입이 가능합니다.</p>
          </CardFooter>
        </Card>
      </div>
      <TermsModal
        open={termsModalOpen}
        onOpenChange={setTermsModalOpen}
        title="이용약관"
        content="스마트 홀세일 플랫폼 이용약관 내용..."
        onAgree={() => {
          form.setValue("termsAgreed", true)
          setTermsModalOpen(false)
        }}
      />

      <TermsModal
        open={privacyModalOpen}
        onOpenChange={setPrivacyModalOpen}
        title="개인정보 처리방침"
        content="스마트 홀세일 플랫폼 개인정보 처리방침 내용..."
        onAgree={() => {
          form.setValue("privacyAgreed", true)
          setPrivacyModalOpen(false)
        }}
      />
    </div>
  )
}
