"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, Eye, CheckCircle, XCircle, Download } from "lucide-react"

// 판매자 신청 타입 정의
interface VendorApplication {
  id: string
  companyName: string
  businessNumber: string
  ceoName: string
  email: string
  phone: string
  businessType: string
  appliedAt: Date
}

export default function AdminApplicationsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 모킹된 판매자 신청 데이터
  const mockApplications: VendorApplication[] = [
    {
      id: "app-1",
      companyName: "스마트 디지털",
      businessNumber: "345-67-89012",
      ceoName: "박디지털",
      email: "hello@smartdigital.com",
      phone: "02-3456-7890",
      businessType: "retail",
      appliedAt: new Date(2023, 4, 5),
    },
    {
      id: "app-2",
      companyName: "글로벌 트레이딩",
      businessNumber: "234-56-78901",
      ceoName: "이수출",
      email: "contact@globaltrading.com",
      phone: "02-2345-6789",
      businessType: "import",
      appliedAt: new Date(2023, 3, 22),
    },
    {
      id: "app-3",
      companyName: "테크 솔루션",
      businessNumber: "567-89-01234",
      ceoName: "정테크",
      email: "support@techsolution.com",
      phone: "02-5678-9012",
      businessType: "manufacturing",
      appliedAt: new Date(2023, 5, 18),
    },
    {
      id: "app-4",
      companyName: "한국 전자",
      businessNumber: "678-90-12345",
      ceoName: "한전자",
      email: "info@koreaelectronics.com",
      phone: "02-6789-0123",
      businessType: "wholesale",
      appliedAt: new Date(2023, 5, 20),
    },
    {
      id: "app-5",
      companyName: "퀵 로지스틱스",
      businessNumber: "789-01-23456",
      ceoName: "최배송",
      email: "service@quicklogistics.com",
      phone: "02-7890-1234",
      businessType: "logistics",
      appliedAt: new Date(2023, 5, 21),
    },
  ]

  // 필터링된 신청 목록
  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.businessNumber.includes(searchTerm) ||
      app.ceoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBusinessType = businessTypeFilter === "all" || app.businessType === businessTypeFilter

    return matchesSearch && matchesBusinessType
  })

  // 신청 상세 정보 보기
  const handleViewApplication = (application: VendorApplication) => {
    setSelectedApplication(application)
    setIsDialogOpen(true)
  }

  // 신청 승인 처리
  const handleApproveApplication = () => {
    if (!selectedApplication) return

    // 실제로는 API 호출을 통해 승인 처리를 해야 합니다.
    toast({
      title: "판매자 신청 승인 완료",
      description: `${selectedApplication.companyName}의 판매자 가입이 승인되었습니다.`,
    })

    setIsDialogOpen(false)
  }

  // 신청 거절 처리
  const handleRejectApplication = () => {
    if (!selectedApplication) return

    // 실제로는 API 호출을 통해 거절 처리를 해야 합니다.
    toast({
      title: "판매자 신청 거절",
      description: `${selectedApplication.companyName}의 판매자 가입이 거절되었습니다.`,
    })

    setIsDialogOpen(false)
  }

  // 업종 한글 변환
  const getBusinessTypeText = (type: string) => {
    const types: Record<string, string> = {
      wholesale: "도매업",
      retail: "소매업",
      manufacturing: "제조업",
      import: "수입업",
      export: "수출업",
      logistics: "물류/운송업",
      other: "기타",
    }
    return types[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">판매자 가입 심사</h1>
        <Badge className="text-sm px-3 py-1">대기: {mockApplications.length}건</Badge>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="판매자명, 사업자번호, 대표자명 검색..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-[180px]">
          <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="업종 필터" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 업종</SelectItem>
              <SelectItem value="wholesale">도매업</SelectItem>
              <SelectItem value="retail">소매업</SelectItem>
              <SelectItem value="manufacturing">제조업</SelectItem>
              <SelectItem value="import">수입업</SelectItem>
              <SelectItem value="export">수출업</SelectItem>
              <SelectItem value="logistics">물류/운송업</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>판매자명</TableHead>
              <TableHead>사업자번호</TableHead>
              <TableHead>대표자명</TableHead>
              <TableHead>업종</TableHead>
              <TableHead>신청일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.companyName}</TableCell>
                  <TableCell>{application.businessNumber}</TableCell>
                  <TableCell>{application.ceoName}</TableCell>
                  <TableCell>{getBusinessTypeText(application.businessType)}</TableCell>
                  <TableCell>{application.appliedAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewApplication(application)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">상세 보기</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 신청 상세 정보 모달 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>판매자 가입 신청 상세</DialogTitle>
            <DialogDescription>판매자 가입 신청을 검토하고 승인 또는 거절하세요.</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">판매자명</h4>
                  <p>{selectedApplication.companyName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">사업자번호</h4>
                  <p>{selectedApplication.businessNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">대표자명</h4>
                  <p>{selectedApplication.ceoName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">업종</h4>
                  <p>{getBusinessTypeText(selectedApplication.businessType)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">이메일</h4>
                  <p>{selectedApplication.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">연락처</h4>
                  <p>{selectedApplication.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">신청일</h4>
                  <p>{selectedApplication.appliedAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">첨부 서류</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    사업자등록증
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    통장사본
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleRejectApplication} className="gap-1">
              <XCircle className="h-4 w-4" />
              거절하기
            </Button>
            <Button onClick={handleApproveApplication} className="gap-1">
              <CheckCircle className="h-4 w-4" />
              승인하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
