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
      finalPrice: data.finalPrice ?? 0,
      address: data.address ?? '',
      payment: data.payment ?? '',
      delivery: data.delivery ?? '',
      date: data.date ?? '',
      totalItems: data.totalItems ?? 0,
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}