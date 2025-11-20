import type { Order } from './order.types'

export const OrderFactory = {
  fromApi(data: any): Order {
    return {
      id: data.id,
      idStatus: data.idStatus,
      vinted: data.vinted ?? '',
      instagram: data.instagram ?? '',
      whatsapp: data.whatsapp ?? '',
      wallapop: data.wallapop ?? '',
      price: data.price ?? 0,
      date: data.date ?? '',
      designs: data.designs ?? []
    }
  }
}