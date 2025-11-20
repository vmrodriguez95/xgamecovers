export interface Order {
  id: number
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
  designs: number[]
}

export interface OrderItem {
  id: number
  idOrder: number
  idDesign: number
  idStatus: number
  idPlatform: number
  price: number
}
