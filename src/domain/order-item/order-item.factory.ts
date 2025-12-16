import type { OrderItem } from './order-item.types'

export const OrderItemFactory = {
  fromApi(data: any): OrderItem {
    return {
      id: data.id,
      idOrder: data.idOrder,
      idDesign: data.idDesign,
      idStatus: data.idStatus,
      idConsole: data.idConsole,
      idVersion: data.idVersion,
      price: data.price ?? 0,
      notes: data.notes ?? '',
      combination: data.combination ?? '',
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}