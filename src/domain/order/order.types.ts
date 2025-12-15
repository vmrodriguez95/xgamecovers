export interface Order {
  id: string
  idStatus: string
  name: string
  whatsapp: string
  wallapop: string
  instagram: string
  vinted: string
  discount: number
  finalPrice: number
  address: string
  payment: string
  date: string
  totalItems: number
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  idOrder: string
  idDesign: string
  idStatus: string
  idPlatform: string
  price: number
  createdAt: string
  updatedAt: string
}
