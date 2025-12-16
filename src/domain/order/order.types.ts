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
  delivery: number
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
  idConsole: string
  idVersion: string
  price: number
  createdAt: string
  updatedAt: string
}
