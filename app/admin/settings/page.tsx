"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "스마트 도소매 플랫폼",
    siteDescription: "해외 상품 분석 및 구매 대행 서비스",
    contactEmail: "contact@smartwholesale.com",
    contactPhone: "02-1234-5678",
    logoUrl: "/vibrant-shopping-cart.png",
  })

  const [feeSettings, setFeeSettings] = useState({
    serviceFeeRate: 5,
    taxRate: 8,
    baseShippingFee: 15000,
    additionalShippingFeePerKg: 2000,
    minOrderAmount: 100000,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enablePushNotifications: true,
    notifyOnNewOrder: true,
    notifyOnOrderStatusChange: true,
    notifyOnNewInquiry: true,
  })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeeSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFeeSettings((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleNotificationToggle = (name: string) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSaveSettings = (settingsType: string) => {
    // 실제 구현에서는 API 호출
    toast({
      title: "설정 저장 완료",
      description: `${settingsType} 설정이 성공적으로 저장되었습니다.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">관리자 설정</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">일반 설정</TabsTrigger>
          <TabsTrigger value="fees">수수료 및 배송비</TabsTrigger>
          <TabsTrigger value="notifications">알림 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
              <CardDescription>사이트의 기본 정보를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">사이트 이름</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">사이트 설명</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">연락처 이메일</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">연락처 전화번호</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">로고 URL</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={generalSettings.logoUrl}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <Button onClick={() => handleSaveSettings("일반")}>설정 저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>수수료 및 배송비 설정</CardTitle>
              <CardDescription>서비스 수수료, 관세, 배송비 등을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceFeeRate">서비스 수수료 (%)</Label>
                <Input
                  id="serviceFeeRate"
                  name="serviceFeeRate"
                  type="number"
                  value={feeSettings.serviceFeeRate}
                  onChange={handleFeeSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">관세율 (%)</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  value={feeSettings.taxRate}
                  onChange={handleFeeSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseShippingFee">기본 배송비 (원)</Label>
                <Input
                  id="baseShippingFee"
                  name="baseShippingFee"
                  type="number"
                  value={feeSettings.baseShippingFee}
                  onChange={handleFeeSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalShippingFeePerKg">추가 배송비 (원/kg)</Label>
                <Input
                  id="additionalShippingFeePerKg"
                  name="additionalShippingFeePerKg"
                  type="number"
                  value={feeSettings.additionalShippingFeePerKg}
                  onChange={handleFeeSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">최소 주문 금액 (원)</Label>
                <Input
                  id="minOrderAmount"
                  name="minOrderAmount"
                  type="number"
                  value={feeSettings.minOrderAmount}
                  onChange={handleFeeSettingsChange}
                />
              </div>
              <Button onClick={() => handleSaveSettings("수수료 및 배송비")}>설정 저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 및 통지 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">알림 채널</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableEmailNotifications">이메일 알림</Label>
                    <p className="text-sm text-muted-foreground">이메일을 통한 알림을 활성화합니다.</p>
                  </div>
                  <Switch
                    id="enableEmailNotifications"
                    checked={notificationSettings.enableEmailNotifications}
                    onCheckedChange={() => handleNotificationToggle("enableEmailNotifications")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableSmsNotifications">SMS 알림</Label>
                    <p className="text-sm text-muted-foreground">SMS를 통한 알림을 활성화합니다.</p>
                  </div>
                  <Switch
                    id="enableSmsNotifications"
                    checked={notificationSettings.enableSmsNotifications}
                    onCheckedChange={() => handleNotificationToggle("enableSmsNotifications")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enablePushNotifications">푸시 알림</Label>
                    <p className="text-sm text-muted-foreground">웹 푸시 알림을 활성화합니다.</p>
                  </div>
                  <Switch
                    id="enablePushNotifications"
                    checked={notificationSettings.enablePushNotifications}
                    onCheckedChange={() => handleNotificationToggle("enablePushNotifications")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">알림 이벤트</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnNewOrder">새 주문</Label>
                    <p className="text-sm text-muted-foreground">새 주문이 접수되면 알림을 받습니다.</p>
                  </div>
                  <Switch
                    id="notifyOnNewOrder"
                    checked={notificationSettings.notifyOnNewOrder}
                    onCheckedChange={() => handleNotificationToggle("notifyOnNewOrder")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnOrderStatusChange">주문 상태 변경</Label>
                    <p className="text-sm text-muted-foreground">주문 상태가 변경되면 알림을 받습니다.</p>
                  </div>
                  <Switch
                    id="notifyOnOrderStatusChange"
                    checked={notificationSettings.notifyOnOrderStatusChange}
                    onCheckedChange={() => handleNotificationToggle("notifyOnOrderStatusChange")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnNewInquiry">새 문의</Label>
                    <p className="text-sm text-muted-foreground">새 문의가 접수되면 알림을 받습니다.</p>
                  </div>
                  <Switch
                    id="notifyOnNewInquiry"
                    checked={notificationSettings.notifyOnNewInquiry}
                    onCheckedChange={() => handleNotificationToggle("notifyOnNewInquiry")}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("알림")}>설정 저장</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
