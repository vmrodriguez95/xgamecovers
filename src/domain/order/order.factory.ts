import type { Order } from './order.types'

export const OrderFactory = {
  fromApi(data: any): Order {
    return {
      id: data.id,
      idStatus: data.idStatus,
      name: data.name ?? '',
      vinted: data.vinted ?? '',
      instagram: data.instagram ?? '',
      whatsapp: data.whatsapp ?? '',
      wallapop: data.wallapop ?? '',
      discount: data.discount ?? 0,
      finalPrice: data.price ?? 0,
      date: data.date ?? '',
      address: data.address ?? '',
      designs: data.designs ?? []
    }
  }
}