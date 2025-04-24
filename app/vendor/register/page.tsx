"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Upload, Building2, User, FileText } from "lucide-react"
import { TermsModal } from "@/components/terms-modal"

// 폼 스키마 정의 - JSX 외부에서 정의
const formSchema = z.object({
  companyName: z.string().min(2, "회사명은 2자 이상이어야 합니다."),
  businessNumber: z
    .string()
    .min(10, "사업자등록번호는 10자리여야 합니다.")
    .max(10, "사업자등록번호는 10자리여야 합니다."),
  representativeName: z.string().min(2, "대표자명은 2자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  phone: z.string().min(10, "전화번호는 10자리 이상이어야 합니다."),
  address: z.string().min(5, "주소는 5자 이상이어야 합니다."),
  businessType: z.string().min(1, "업종을 선택해주세요."),
  description: z.string().min(10, "회사 소개는 10자 이상이어야 합니다."),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "이용약관에 동의해주세요.",
  }),
  privacyAgreed: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해주세요.",
  }),
})

export default function VendorRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null)
  const [bankAccountFile, setBankAccountFile] = useState<File | null>(null)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)

  // 폼 초기화
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      businessNumber: "",
      representativeName: "",
      email: "",
      phone: "",
      address: "",
      businessType: "",
      description: "",
      termsAgreed: false,
      privacyAgreed: false,
    },
  })

  // 폼 제출 처리
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    // 파일 첨부 확인
    if (!businessLicenseFile) {
      toast({
        title: "사업자등록증을 첨부해주세요",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (!bankAccountFile) {
      toast({
        title: "통장사본을 첨부해주세요",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // 여기서 실제 API 호출을 수행할 수 있습니다.
      // 현재는 모킹된 응답을 사용합니다.
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "판매자 가입 신청이 완료되었습니다",
        description: "신청 내용을 검토 후 이메일로 결과를 안내드리겠습니다.",
      })

      // 홈페이지로 리다이렉트
      router.push("/")
    } catch (error) {
      console.error("Error submitting vendor registration:", error)
      toast({
        title: "가입 신청 중 오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 파일 업로드 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "business" | "bank") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "business") {
        setBusinessLicenseFile(e.target.files[0])
      } else {
        setBankAccountFile(e.target.files[0])
      }
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">판매자 가입 신청</h1>
          <p className="text-muted-foreground">
            스마트 도소매 플랫폼의 판매자가 되어 새로운 비즈니스 기회를 만나보세요.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>판매자 정보 입력</CardTitle>
            <CardDescription>
              판매자 가입을 위해 아래 정보를 정확히 입력해주세요. 모든 정보는 심사 과정에서 확인됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    회사 정보
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상호명 *</FormLabel>
                          <FormControl>
                            <Input placeholder="상호명을 입력하세요" {...field} />
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
                          <FormLabel>사업자등록번호 *</FormLabel>
                          <FormControl>
                            <Input placeholder="000-00-00000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>업종 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="업종을 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wholesale">도매업</SelectItem>
                              <SelectItem value="retail">소매업</SelectItem>
                              <SelectItem value="manufacturing">제조업</SelectItem>
                              <SelectItem value="import">수입업</SelectItem>
                              <SelectItem value="export">수출업</SelectItem>
                              <SelectItem value="logistics">물류/운송업</SelectItem>
                              <SelectItem value="other">기타</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>웹사이트</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormDescription>선택 사항입니다.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사업 설명 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="취급하는 상품과 서비스에 대해 간략히 설명해주세요."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    대표자 정보
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ceoName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>대표자명 *</FormLabel>
                          <FormControl>
                            <Input placeholder="대표자명을 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>

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

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    필수 서류
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        사업자등록증 *
                      </label>
                      <div className="mt-1 flex items-center">
                        <label
                          htmlFor="business-license"
                          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/25 px-4 py-2 text-center hover:bg-muted"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="mt-2 text-sm font-medium">
                            {businessLicenseFile ? businessLicenseFile.name : "파일을 선택하세요"}
                          </span>
                          <span className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG (최대 5MB)</span>
                          <input
                            id="business-license"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "business")}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        통장사본 *
                      </label>
                      <div className="mt-1 flex items-center">
                        <label
                          htmlFor="bank-account"
                          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/25 px-4 py-2 text-center hover:bg-muted"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="mt-2 text-sm font-medium">
                            {bankAccountFile ? bankAccountFile.name : "파일을 선택하세요"}
                          </span>
                          <span className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG (최대 5MB)</span>
                          <input
                            id="bank-account"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "bank")}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
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
                            에 동의합니다 제조업체
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
                            에 동의합니다 제조업체
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "제출 중..." : "판매자 가입 신청하기"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
            <p>* 표시된 항목은 필수 입력 사항입니다.</p>
            <p>제출된 정보는 심사 과정에서만 사용되며, 개인정보 처리방침에 따라 안전하게 보관됩니다.</p>
            <p>심사는 영업일 기준 1-3일 소요되며, 결과는 이메일로 안내드립니다.</p>
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
