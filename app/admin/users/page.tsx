"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Edit, Ban, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 모킹된 사용자 데이터
const mockUsers = [
  {
    id: "user-1",
    email: "test@test.com",
    name: "테스트 사용자",
    phone: "010-1234-5678",
    address: "서울특별시 강남구",
    status: "active",
    registeredAt: "2023-10-15",
    lastLogin: "2024-02-20",
    orderCount: 8,
  },
  {
    id: "user-2",
    email: "hong@example.com",
    name: "홍길동",
    phone: "010-2345-6789",
    address: "서울특별시 서초구",
    status: "active",
    registeredAt: "2023-11-05",
    lastLogin: "2024-02-18",
    orderCount: 5,
  },
  {
    id: "user-3",
    email: "kim@example.com",
    name: "김철수",
    phone: "010-3456-7890",
    address: "경기도 성남시",
    status: "inactive",
    registeredAt: "2023-12-10",
    lastLogin: "2024-01-15",
    orderCount: 2,
  },
  {
    id: "user-4",
    email: "lee@example.com",
    name: "이영희",
    phone: "010-4567-8901",
    address: "인천광역시 연수구",
    status: "active",
    registeredAt: "2024-01-20",
    lastLogin: "2024-02-19",
    orderCount: 3,
  },
  {
    id: "user-5",
    email: "park@example.com",
    name: "박민수",
    phone: "010-5678-9012",
    address: "부산광역시 해운대구",
    status: "active",
    registeredAt: "2023-09-25",
    lastLogin: "2024-02-15",
    orderCount: 12,
  },
  {
    id: "user-6",
    email: "choi@example.com",
    name: "최지은",
    phone: "010-6789-0123",
    address: "대구광역시 수성구",
    status: "blocked",
    registeredAt: "2023-08-15",
    lastLogin: "2023-12-05",
    orderCount: 1,
  },
]

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

  const handleEditClick = (user: any) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    // 실제 구현에서는 API 호출
    const updatedUsers = users.map((u) => (u.id === selectedUser.id ? { ...u, ...editForm } : u))
    setUsers(updatedUsers)
    setIsEditDialogOpen(false)

    toast({
      title: "사용자 정보 업데이트 완료",
      description: "사용자 정보가 성공적으로 업데이트되었습니다.",
    })
  }

  const handleStatusToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active"

    // 실제 구현에서는 API 호출
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    setUsers(updatedUsers)

    toast({
      title: "사용자 상태 변경 완료",
      description: `사용자 상태가 ${newStatus === "active" ? "활성화" : "비활성화"}되었습니다.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">활성</Badge>
      case "inactive":
        return <Badge variant="secondary">비활성</Badge>
      case "blocked":
        return <Badge variant="destructive">차단됨</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">사용자 관리</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 이메일 또는 전화번호로 검색"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>주문 수</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.registeredAt}</TableCell>
                      <TableCell>{user.orderCount}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">수정</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleStatusToggle(user.id, user.status)}>
                            {user.status === "active" ? (
                              <Ban className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <span className="sr-only">{user.status === "active" ? "비활성화" : "활성화"}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정��� 수정</DialogTitle>
            <DialogDescription>사용자 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                required
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="blocked">차단됨</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditSubmit}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
