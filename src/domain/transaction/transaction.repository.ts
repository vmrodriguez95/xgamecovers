import { rtdbService } from '../../firebase/rtdb.service'
import { TransactionFactory } from './transaction.factory'
import type { Transaction } from './transaction.types'

const PATH = 'transaction'

export class TransactionRepository {
  async getAll(): Promise<Transaction[]> {
    const data = await rtdbService.getAllOrderedBy(PATH, 'updatedAt')
    
    data.reverse() // DESC

    return data.map(TransactionFactory.fromApi)
  }

  async getById(id: string): Promise<Transaction | null> {
    const data = await rtdbService.getById(PATH, id)
    return data ? TransactionFactory.fromApi(data) : null
  }

  async create(data: Transaction) {
    await rtdbService.set(PATH, data)
  }

  async update(id: string, partial: Partial<Transaction>) {
    await rtdbService.update(PATH, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }
}

export const transactionRepository = new TransactionRepository()