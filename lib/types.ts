export interface ProductData {
  id: string
  title: string
  platform: string
  originalPrice: number
  estimatedPrice: number
  imageUrl: string
  fees: number
  tax: number
  shippingCost: number
  originalUrl: string
}

export interface OrderHistory {
  date: string
  status: string
  description?: string
}

export interface ShippingInfo {
  name: string
  phone: string
  email: string
  address: string
  detailAddress: string
  zipCode: string
  requestNote?: string
}

export interface OrderDetail {
  id: string
  status: string
  orderDate: string
  estimatedDeliveryDate?: string
  trackingNumber?: string
  totalAmount: number
  product: ProductData
  shipping: ShippingInfo
  paymentMethod?: string
  history: OrderHistory[]
}
