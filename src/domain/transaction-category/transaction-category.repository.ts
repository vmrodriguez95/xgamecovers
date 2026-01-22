import { rtdbService } from '../../firebase/rtdb.service'
import { TransactionCategoryFactory } from './transaction-category.factory'
import type { TransactionCategory } from './transaction-category.types'

const PATH = 'transactionsCategory'

class TransactionCategoryRepository {
  async getAll(): Promise<TransactionCategory[]> {
    const data = await rtdbService.getAllOrderedBy(PATH, 'order')
    return data.map(TransactionCategoryFactory.fromApi)
  }

  async getById(id: string): Promise<TransactionCategory | null> {
    const data = await rtdbService.getById(PATH, id)
    return data ? TransactionCategoryFactory.fromApi(data) : null
  }
}

export const transactionCategoryRepository = new TransactionCategoryRepository()