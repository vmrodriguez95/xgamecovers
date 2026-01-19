import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { until } from 'lit/directives/until.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import type { Transaction } from '../../domain/transaction/transaction.types.ts'
import type { TransactionCategory } from '../../domain/transaction-category/transaction-category.types.ts'

// Repositories
import { orderRepository } from '../../domain/order/order.repository.ts'
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'
import { transactionCategoryRepository } from '../../domain/transaction-category/transaction-category.repository.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Utils
import { getMonthName } from '../../utils/date.utils.ts'

// Styles
import style from './v-transaction.style.scss?inline'

@customElement('v-transaction')
class VTransaction extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() transactions: Transaction[] = []

  @state() transactionCategories: TransactionCategory[] = []

  @state() total: number = 0

  totalExpense: number = 0

  totalIncome: number = 0

  lastMonth: string = ''

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()

    this._loadTransactionCategories()
    this._loadTransactions()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-transaction">
          <div class="v-transaction__resume">
            <a href="${this._getCreationRoute()}" class="v-transaction__create">
              <e-icon icon="add"></e-icon>
            </a>
            <p class="v-transaction__total">${this.total}€</p>
            <span class="v-transaction__semitotal v-transaction__semitotal--income">${this.totalIncome}€</span>
            <span class="v-transaction__semitotal v-transaction__semitotal--expense">-${this.totalExpense}€</span>
            ${map(this.transactionCategories, (transactionCategory: TransactionCategory) => this._printCategories(transactionCategory))}
          </div>
          <div class="v-transaction__list">
            ${map(this.transactions, (transaction: Transaction) => html`
              ${when(this.hasMonthChanged(transaction.updatedAt), () => html`
                <p class="v-transaction__title">${getMonthName(transaction.updatedAt)}</p>
              `)}
              ${until(this._getTransactionHTML(transaction))}
            `)}
          </div>
        </div>
      `,
      this.heading
    )
  }

  hasMonthChanged(transactionDate: string) {
    return getMonthName(transactionDate) !== this.lastMonth
  }

  async _loadTransactionCategories() {
    this.transactionCategories = await transactionCategoryRepository.getAll()
  }

  async _loadTransactions() {
    this.transactions = await transactionRepository.getAll()

    this._calculateTotals()
  }

  _getCategory(idCategory: string) {
    return this.transactionCategories.find((category: TransactionCategory) => category.id === idCategory)
  }

  _getAllTransactionsByCategory(idCategory: string = '') {
    return this.transactions.filter((transaction: Transaction) => transaction.idCategory === idCategory)
  }

  _getTransactionsAmountByCategory(idCategory: string) {
    return this._getAllTransactionsByCategory(idCategory).reduce((total: number, transaction: Transaction) => total + parseInt(transaction.amount.toString()), 0)
  }

  _calculateProgressByCategory(idCategory: string, amount: number = 0) {
    const category = this._getCategory(idCategory)
    if (!category) return 0

    const total = category.type === 'expense' ? this.totalExpense : this.totalIncome

    return amount * 100 / total
  }

  _calculateTotals() {
    let total = 0, totalIncome = 0, totalExpense = 0

    this.transactions.forEach((transaction: Transaction) => {
      const amount = parseInt(transaction.amount.toString())
      const category = this._getCategory(transaction.idCategory)

      if(!category) return

      if (category.type === 'expense') {
        total -= amount
        totalExpense += amount
      } else {
        total += amount
        totalIncome += amount
      }
    })

    this.total = total
    this.totalIncome = totalIncome
    this.totalExpense = totalExpense
  }

  _printCategories(category: TransactionCategory) {
    const amount = this._getTransactionsAmountByCategory(category.id)

    return html`
      <c-card-progress
        class="v-transaction__card"
        name=${category.name}
        color=${category.color}
        icon=${category.icon}
        money="${category.type === 'expense' ? '-' : ''}${amount}"
        progress=${this._calculateProgressByCategory(category.id, amount)}
      ></c-card-progress>
    `
  }

  async _getTransactionHTML(transaction: Transaction) {
    const category = this._getCategory(transaction.idCategory)
    if (!category || !transaction) return ''

    this.lastMonth = getMonthName(transaction.updatedAt)

    if (transaction.idOrder) {
      const order = await orderRepository.getById(transaction.idOrder)

      if (!order) return ''

      return html`
        <a class="v-transaction__card" href="${this._getOrderViewRoute(transaction)}">
          <c-card-simple
            type=${category.name}
            name=${order.name}
            platform=${order.payment}
            date=${transaction.updatedAt}
            money=${transaction.amount}
            icon=${category.icon}
            color=${category.color}
          ></c-card-simple>
        </a>
      `
    }

    return html`
      <a class="v-transaction__card" href="${this._getEditRoute(transaction)}">
        <c-card-simple
          type=${category.name}
          date=${transaction.updatedAt}
          money="${category.type === 'expense' ? '-' : ''}${transaction.amount}"
          icon=${category.icon}
          color=${category.color}
        ></c-card-simple>
      </a>
    `
  }

  private _getCreationRoute() {
    return this._routerController.getAdminRoute('transactionNew', {})
  }

  private _getEditRoute(transaction: Transaction) {
    return this._routerController.getAdminRoute('transactionEdit', { id: transaction.id })
  }

  private _getOrderViewRoute(transaction: Transaction) {
    return this._routerController.getAdminRoute('orderView', { id: transaction.idOrder })
  }
}