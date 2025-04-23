"use client"

import { useState } from "react"
import Image from "next/image"
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
import { Label } from "@/components/ui/label"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockProducts } from "@/lib/mock-data"

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    originalPrice: 0,
    platform: "",
  })

  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditClick = (product: any) => {
    setSelectedProduct(product)
    setEditForm({
      title: product.title || "",
      originalPrice: product.originalPrice || 0,
      platform: product.platform || "Alibaba",
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleEditSubmit = () => {
    // 실제 구현에서는 API 호출
    const updatedProducts = products.map((p) => (p.id === selectedProduct.id ? { ...p, ...editForm } : p))
    setProducts(updatedProducts)
    setIsEditDialogOpen(false)

    toast({
      title: "상품 정보 업데이트 완료",
      description: "상품 정보가 성공적으로 업데이트되었습니다.",
    })
  }

  const handleDeleteConfirm = () => {
    // 실제 구현에서는 API 호출
    const updatedProducts = products.filter((p) => p.id !== selectedProduct.id)
    setProducts(updatedProducts)
    setIsDeleteDialogOpen(false)

    toast({
      title: "상품 삭제 완료",
      description: "상품이 성공적으로 삭제되었습니다.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />새 상품 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>상품 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품명 또는 ID로 검색"
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
                  <TableHead>이미지</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead>플랫폼</TableHead>
                  <TableHead>원가</TableHead>
                  <TableHead>예상 판매가</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                          <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.title || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{product.title}</TableCell>
                      <TableCell>{product.platform || "Alibaba"}</TableCell>
                      <TableCell>{product.originalPrice?.toLocaleString()}원</TableCell>
                      <TableCell>
                        {(product.originalPrice ? Math.ceil(product.originalPrice * 1.3) : 0).toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">수정</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">삭제</span>
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

      {/* 상품 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상품 정보 수정</DialogTitle>
            <DialogDescription>상품 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">상품명</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">플랫폼</Label>
              <Input
                id="platform"
                value={editForm.platform}
                onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">원가</Label>
              <Input
                id="originalPrice"
                type="number"
                value={editForm.originalPrice}
                onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                required
              />
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

      {/* 상품 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상품 삭제</DialogTitle>
            <DialogDescription>정말로 이 상품을 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <span className="font-medium">{selectedProduct?.title}</span> 상품을 삭제하면 복구할 수 없습니다.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
