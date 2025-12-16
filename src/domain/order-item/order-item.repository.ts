import { rtdbService } from '../../firebase/rtdb.service'
import { OrderItemFactory } from './order-item.factory'
import type { OrderItem } from './order-item.types'

const PATH = 'orderItem'

class OrderItemRepository {
  async getById(id: string): Promise<OrderItem | null> {
    const data = await rtdbService.getById(PATH, id)
    return data ? OrderItemFactory.fromApi(data) : null
  }

  async getAllByIdOrder(id: string): Promise<OrderItem | null> {
    const data = await rtdbService.filterByChild(PATH, 'idOrder', id)

    return data ? OrderItemFactory.fromApi(data) : null
  }

  async create(data: OrderItem) {
    return await rtdbService.set(PATH, data)
  }

  async update(id: string, partial: Partial<OrderItem>) {
    await rtdbService.update(PATH, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }
}

export const orderItemRepository = new OrderItemRepository()