export interface Order {
  id: string
  idStatus: number
  name: string
  whatsapp: string
  wallapop: string
  instagram: string
  vinted: string
  discount: number
  finalPrice: number
  date: string
  address: string
  designs: string[]
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
