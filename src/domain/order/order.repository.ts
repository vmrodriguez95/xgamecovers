import { rtdbService } from '../../firebase/rtdb.service'
import { OrderFactory } from './order.factory'
import type { Order } from './order.types'

const PATH = 'orders'

export class OrdersRepository {
  async getAll(): Promise<Order[]> {
    const data = await rtdbService.getAll(PATH)
    return data.map(OrderFactory.fromApi)
  }

  async getById(id: string): Promise<Order | null> {
    const data = await rtdbService.getById(PATH, id)
    return data ? OrderFactory.fromApi(data) : null
  }

  async create(id: string, input: Order) {
    await rtdbService.set(PATH, id, input)
  }

  async update(id: string, partial: Partial<Order>) {
    await rtdbService.update(PATH, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }
}

export const ordersRepository = new OrdersRepository()