import type { TransactionCategory } from './transaction-category.types'

export const TransactionCategoryFactory = {
  fromApi(data: any): TransactionCategory {
    return {
      id: data.id,
      name: data.name ?? '',
      icon: data.icon ?? '',
      type: data.type ?? '',
      color: data.color ?? ''
    }
  }
}