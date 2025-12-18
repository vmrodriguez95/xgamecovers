import { rtdbService } from '../../firebase/rtdb.service'
import { OrderFactory } from './order.factory'
import type { Order } from './order.types'

const PATH = 'order'

export class OrderRepository {
  async getAll(): Promise<Order[]> {
    const data = await rtdbService.getAll(PATH)
    return data.map(OrderFactory.fromApi)
  }

  async getAllOrderedByDate(): Promise<Order[]> {
    const data = await rtdbService.getAllOrderedBy(PATH, 'updatedAt')

    data.reverse()

    return data.map(OrderFactory.fromApi)
  }

  async getById(id: string): Promise<Order | null> {
    const data = await rtdbService.getById(PATH, id)
    return data ? OrderFactory.fromApi(data) : null
  }

  async create(data: Order) {
    return await rtdbService.set(PATH, data)
  }

  async update(id: string, partial: Partial<Order>) {
    await rtdbService.update(PATH, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }
}

export const orderRepository = new OrderRepository()