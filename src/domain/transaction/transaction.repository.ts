import { rtdbService } from '../../firebase/rtdb.service'
import { TransactionFactory } from './transaction.factory'
import type { Transaction } from './transaction.types'

const PATH = 'transaction'

class TransactionRepository {
  async getAll(): Promise<Transaction[]> {
    const data = await rtdbService.getAllOrderedBy(PATH, 'updatedAt')
    
    data.reverse() // DESC

    return data.map(TransactionFactory.fromApi)
  }

  async getById(id: string): Promise<Transaction | null> {
    const data = await rtdbService.getById(PATH, id)
    return data ? TransactionFactory.fromApi(data) : null
  }

  async getByIdOrder(idOrder: string): Promise<Transaction | null> {
    const data = await rtdbService.filterByChild(PATH, 'idOrder', idOrder)
    return data ? TransactionFactory.fromApi(data[0]) : null
  }

  async create(data: Transaction) {
    await rtdbService.set(PATH, data)
  }

  async update(id: string, partial: Partial<Transaction>) {
    await rtdbService.update(PATH, id, partial)
  }

  async updateByIdOrder(idOrder: string, partial: Partial<Transaction>) {
    const transaction = await this.getByIdOrder(idOrder)

    if (!transaction?.id) return

    await rtdbService.update(PATH, transaction.id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }

  async deleteByIdOrder(idOrder: string) {
    const transaction = await this.getByIdOrder(idOrder)

    if (!transaction?.id ) return

    await rtdbService.delete(PATH, transaction.id)
  }
}

export const transactionRepository = new TransactionRepository()