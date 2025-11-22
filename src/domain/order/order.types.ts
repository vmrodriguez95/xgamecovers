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
  designs: number[]
}

export interface OrderItem {
  id: string
  idOrder: number
  idDesign: number
  idStatus: number
  idPlatform: number
  price: number
}
