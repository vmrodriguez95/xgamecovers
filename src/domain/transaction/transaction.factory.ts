import type { Transaction } from './transaction.types'

export const TransactionFactory = {
  fromApi(data: any): Transaction {
    return {
      id: data.id,
      idCategory: data.idCategory,
      idOrder: data.idOrder || '',
      idOrderStatus: data.idOrderStatus || '',
      amount: data.amount ?? 0,
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}