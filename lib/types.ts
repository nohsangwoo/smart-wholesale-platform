export interface ProductData {
  id: string
  title: string
  originalUrl?: string
  platform: string
  originalPrice: number
  estimatedPrice: number
  imageUrl?: string
  fees: number
  tax: number
  shippingCost: number
  additionalNotes?: string
  specifications?: { name: string; value: string }[]
  seller?: {
    name: string
    rating: number
    responseRate: number
    responseTime: string
    transactions: number
  }
}

export interface OrderDetail {
  id: string
  status: string
  orderDate: string
  estimatedDeliveryDate?: string
  trackingNumber?: string
  totalAmount: number
  product: {
    id: string
    title: string
    platform: string
    originalPrice: number
    estimatedPrice: number
    imageUrl?: string
    fees: number
    tax: number
    shippingCost: number
    originalUrl?: string
  }
  shipping: {
    name: string
    phone: string
    email: string
    address: string
    detailAddress?: string
    zipCode: string
    requestNote?: string
  }
  paymentMethod?: string
  history: {
    date: string
    status: string
    description?: string
  }[]
  trackingNumber?: string
}
