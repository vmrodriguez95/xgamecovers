export interface Transaction {
  id: number
  idCategory: number
  date: string
  amount: number
}

export interface TransactionCategory {
  id: number
  name: string
  icon: string
  type: string // 'expense' | 'income'
  color: string
}