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

// 판매자 타입 정의
interface Vendor {
  id: string
  companyName: string
  businessNumber: string
  ceoName: string
  email: string
  phone: string
  businessType: string
  status: "pending" | "approved" | "rejected"
  registeredAt: Date
}

export default function AdminVendorsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 모킹된 판매자 데이터
  const mockVendors: Vendor[] = [
    {
      id: "vendor-1",
      companyName: "키키퍼 로지스틱스",
      businessNumber: "123-45-67890",
      ceoName: "김물류",
      email: "info@kikeeper.com",
      phone: "02-1234-5678",
      businessType: "logistics",
      status: "approved",
      registeredAt: new Date(2023, 1, 15),
    },
    {
      id: "vendor-2",
      companyName: "글로벌 트레이딩",
      businessNumber: "234-56-78901",
      ceoName: "이수출",
      email: "contact@globaltrading.com",
      phone: "02-2345-6789",
      businessType: "import",
      status: "pending",
      registeredAt: new Date(2023, 3, 22),
    },
    {
      id: "vendor-3",
      companyName: "스마트 디지털",
      businessNumber: "345-67-89012",
      ceoName: "박디지털",
      email: "hello@smartdigital.com",
      phone: "02-3456-7890",
      businessType: "retail",
      status: "pending",
      registeredAt: new Date(2023, 4, 5),
    },
    {
      id: "vendor-4",
      companyName: "패션 홀세일",
      businessNumber: "456-78-90123",
      ceoName: "최패션",
      email: "info@fashionwholesale.com",
      phone: "02-4567-8901",
      businessType: "wholesale",
      status: "rejected",
      registeredAt: new Date(2023, 2, 10),
    },
    {
      id: "vendor-5",
      companyName: "테크 솔루션",
      businessNumber: "567-89-01234",
      ceoName: "정테크",
      email: "support@techsolution.com",
      phone: "02-5678-9012",
      businessType: "manufacturing",
      status: "pending",
      registeredAt: new Date(2023, 5, 18),
    },
  ]

  // 필터링된 판매자 목록
  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.businessNumber.includes(searchTerm) ||
      vendor.ceoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // 판매자 상세 정보 보기
  const handleViewVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsDialogOpen(true)
  }

  // 판매자 승인 처리
  const handleApproveVendor = () => {
    if (!selectedVendor) return

    // 실제로는 API 호출을 통해 승인 처리를 해야 합니다.
    toast({
      title: "판매자 승인 완료",
      description: `${selectedVendor.companyName}의 판매자 가입이 승인되었습니다.`,
    })

    setIsDialogOpen(false)
  }

  // 판매자 거절 처리
  const handleRejectVendor = () => {
    if (!selectedVendor) return

    // 실제로는 API 호출을 통해 거절 처리를 해야 합니다.
    toast({
      title: "판매자 가입 거절",
      description: `${selectedVendor.companyName}의 판매자 가입이 거절되었습니다.`,
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

  // 상태 배지 렌더링
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            심사중
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            거절됨
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">판매자 관리</h1>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="상태 필터" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">심사중</SelectItem>
              <SelectItem value="approved">승인됨</SelectItem>
              <SelectItem value="rejected">거절됨</SelectItem>
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
              <TableHead>상태</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.companyName}</TableCell>
                  <TableCell>{vendor.businessNumber}</TableCell>
                  <TableCell>{vendor.ceoName}</TableCell>
                  <TableCell>{getBusinessTypeText(vendor.businessType)}</TableCell>
                  <TableCell>{renderStatusBadge(vendor.status)}</TableCell>
                  <TableCell>{vendor.registeredAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewVendor(vendor)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">상세 보기</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 판매자 상세 정보 모달 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>판매자 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedVendor?.status === "pending"
                ? "판매자 가입 신청을 검토하고 승인 또는 거절하세요."
                : "판매자 정보를 확인하세요."}
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">판매자명</h4>
                  <p>{selectedVendor.companyName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">사업자번호</h4>
                  <p>{selectedVendor.businessNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">대표자명</h4>
                  <p>{selectedVendor.ceoName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">업종</h4>
                  <p>{getBusinessTypeText(selectedVendor.businessType)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">이메일</h4>
                  <p>{selectedVendor.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">연락처</h4>
                  <p>{selectedVendor.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">상태</h4>
                  <p>{renderStatusBadge(selectedVendor.status)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">등록일</h4>
                  <p>{selectedVendor.registeredAt.toLocaleDateString()}</p>
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
            {selectedVendor?.status === "pending" && (
              <>
                <Button variant="outline" onClick={handleRejectVendor} className="gap-1">
                  <XCircle className="h-4 w-4" />
                  거절하기
                </Button>
                <Button onClick={handleApproveVendor} className="gap-1">
                  <CheckCircle className="h-4 w-4" />
                  승인하기
                </Button>
              </>
            )}
            {selectedVendor?.status !== "pending" && <Button onClick={() => setIsDialogOpen(false)}>닫기</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
