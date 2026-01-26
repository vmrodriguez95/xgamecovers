import type { Order } from './order.types'

export const OrderFactory = {
  fromApi(data: any): Order {
    return {
      id: data.id,
      idClient: data.idClient,
      idStatus: data.idStatus,
      finalPrice: data.finalPrice ?? 0,
      payment: data.payment ?? '',
      delivery: data.delivery ?? '',
      totalItems: data.totalItems ?? 0,
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  },

  createEmpty(): Order {
    return {
      id: '',
      idClient: '',
      idStatus: '',
      finalPrice: 0,
      payment: '',
      delivery: 0,
      totalItems: 0,
      createdAt: '',
      updatedAt: ''
    }
  }
}