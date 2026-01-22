import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { until } from 'lit/directives/until.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import type { Status } from '../../domain/status/status.types.ts'
import type { Transaction } from '../../domain/transaction/transaction.types.ts'
import type { TransactionCategory } from '../../domain/transaction-category/transaction-category.types.ts'

// BBDD
import { statusRepository } from '../../domain/status/status.repository.ts'
import { orderRepository } from '../../domain/order/order.repository.ts'
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'
import { transactionCategoryRepository } from '../../domain/transaction-category/transaction-category.repository.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Utils
import { getMonthName } from '../../utils/date.utils.ts'
import { STATUS_INCOME, TRANSACTION_CATEGORY_TYPE } from '../../utils/consts.utils.ts'

// Styles
import style from './v-transaction.style.scss?inline'

@customElement('v-transaction')
class VTransaction extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _transactions: Transaction[] = []

  @state() _transactionCategories: TransactionCategory[] = []

  @state() _total: number = 0

  _totalCanceled: number = 0

  _totalPending: number = 0

  _totalExpense: number = 0

  _totalIncome: number = 0

  _lastMonth: string = ''

  _listOrderStatus: Status[] = []

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()

    this._loadOrderStatus()
    this._loadTransactionCategories()
    this._loadTransactions()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-transaction">
          <div class="v-transaction__resume">
            <a href=${this._getCreationRoute()} class="v-transaction__create">
              <e-icon icon="add"></e-icon>
            </a>
            <p class="v-transaction__total">${this._total}€</p>
            <span class="v-transaction__semitotal v-transaction__semitotal--income">${this._totalIncome + this._totalPending}€</span>
            <span class="v-transaction__semitotal v-transaction__semitotal--expense">-${this._totalExpense}€</span>
            ${map(this._transactionCategories, (transactionCategory: TransactionCategory) => this._printCategories(transactionCategory))}
          </div>
          <div class="v-transaction__list">
            ${map(this._transactions, (transaction: Transaction) => html`
              ${when(this._hasMonthChanged(transaction.updatedAt), () => html`
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

  /********************************/
  /*********** INITIAL ************/
  /********************************/

  async _loadTransactionCategories() {
    this._transactionCategories = await transactionCategoryRepository.getAll()
  }

  async _loadOrderStatus() {
    this._listOrderStatus = await statusRepository.getAll()
  }

  async _loadTransactions() {
    this._transactions = await transactionRepository.getAll()

    this._calculateTotals()
  }

  /********************************/
  /************ UTILS *************/
  /********************************/
  _hasMonthChanged(transactionDate: string) {
    return getMonthName(transactionDate) !== this._lastMonth
  }

  _isCategoryExpense(category: TransactionCategory) {
    return category.type === TRANSACTION_CATEGORY_TYPE.EXPENSE
  }

  _isCategoryIncome(category: TransactionCategory) {
    return category.type === TRANSACTION_CATEGORY_TYPE.INCOME
  }

  _getStatusById(idStatus: string) {
    return this._listOrderStatus.find((status: Status) => status.id === idStatus)
  }

  _getCategoryById(idCategory: string) {
    return this._transactionCategories.find((category: TransactionCategory) => category.id === idCategory)
  }

  _getAllTransactionsByCategory(idCategory: string = '') {
    return this._transactions.filter((transaction: Transaction) => transaction.idCategory === idCategory)
  }

  /********************************/
  /************ RESUME ************/
  /********************************/
  _getAmountByCategory(idCategory: string) {
    const transactions = this._getAllTransactionsByCategory(idCategory)

    const total = transactions.reduce((total: number, transaction: Transaction) => {
      return total + Number(transaction.amount.toString())
    }, 0)

    return Number(total.toFixed(2))
  }

  _calculateProgress(amount: number, total: number) {
    return amount * 100 / total
  }

  /********************************/
  /************ TOTALS ************/
  /********************************/
  _calculateOrderTotals(transaction: Transaction, total: number = 0, totalIncome: number = 0, totalPending: number = 0, totalCanceled: number = 0) {
    const amount = Number(transaction.amount.toString())
    const status = this._getStatusById(transaction.idOrderStatus)
    let newTotal = 0, newTotalIncome = 0, newTotalPending = 0, newTotalCanceled = 0

    if (status) {
      switch(status.incomeStatus) {
        case STATUS_INCOME.APPROVED:
          newTotal = total + amount
          newTotalIncome = totalIncome + amount
          break
        case STATUS_INCOME.REJECTED:
          newTotalCanceled = totalCanceled + amount
          break
        case STATUS_INCOME.PENDING:
          newTotal = total + amount
          newTotalPending = totalPending + amount
          break
      }
    }

    return {
      total: newTotal,
      totalIncome: newTotalIncome,
      totalPending: newTotalPending,
      totalCanceled: newTotalCanceled
    }
  }

  _calculateCategoryTotals(category: TransactionCategory | undefined, transaction: Transaction, total: number = 0, totalExpense: number = 0, totalIncome: number = 0) {
    const amount = Number(transaction.amount.toString())
    let newTotal = 0, newTotalExpense = 0, newTotalIncome = 0

    if (category && this._isCategoryExpense(category)) {
      newTotal = total - amount
      newTotalExpense = totalExpense + amount
    } else if (category && this._isCategoryIncome(category)) {
      newTotal = total + amount
      newTotalIncome = totalIncome + amount
    }

    return {
      total: newTotal,
      totalExpense: newTotalExpense,
      totalIncome: newTotalIncome
    }
  }

  _calculateTotals() {
    let total = 0, totalIncome = 0, totalExpense = 0, totalPending = 0, totalCanceled = 0

    this._transactions.forEach((transaction: Transaction) => {
      let results = {} as any

      if (transaction.idOrder) {
        results = this._calculateOrderTotals(transaction, total, totalIncome, totalPending)
      } else {
        const category = this._getCategoryById(transaction.idCategory)
        results = this._calculateCategoryTotals(category, transaction, total, totalExpense, totalIncome)
      }

      total = results.total || total
      totalIncome = results.totalIncome || totalIncome
      totalExpense = results.totalExpense || totalExpense
      totalPending = results.totalPending || totalPending
      totalCanceled = results.totalCanceled || totalCanceled
    })

    this._total = Number(total.toFixed(2))
    this._totalIncome = Number(totalIncome.toFixed(2))
    this._totalExpense = Number(totalExpense.toFixed(2))
    this._totalPending = Number(totalPending.toFixed(2))
    this._totalCanceled = Number(totalCanceled.toFixed(2))
  }

  /********************************/
  /************* HTML *************/
  /********************************/
  _printCategories(category: TransactionCategory) {
    if (this._isCategoryExpense(category)) {
      const amount = this._getAmountByCategory(category.id)

      return html`
        <c-card-progress
          class="v-transaction__card"
          name=${category.name}
          color=${category.color}
          icon=${category.icon}
          money="-${amount}"
          progress=${this._calculateProgress(amount, this._totalExpense)}
        ></c-card-progress>
      `
    } else {
      return html`
        <c-card-progress
          class="v-transaction__card"
          name="Beneficios pendientes"
          color=${category.color}
          icon=${category.icon}
          money="${this._totalPending}"
          progress=${this._calculateProgress(this._totalPending, this._totalIncome + this._totalPending)}
        ></c-card-progress>
        <c-card-progress
          class="v-transaction__card"
          name="Beneficios actuales"
          color=${category.color}
          icon=${category.icon}
          money="${this._totalIncome}"
          progress=${this._calculateProgress(this._totalIncome, this._totalIncome + this._totalPending)}
        ></c-card-progress>
        <c-card-progress
          class="v-transaction__card"
          name="Pedidos cancelados"
          color="red"
          icon=${category.icon}
          money="${this._totalCanceled}"
          progress=${this._calculateProgress(this._totalCanceled, this._totalCanceled)}
        ></c-card-progress>
      `
    }
  }

  async _getTransactionHTML(transaction: Transaction) {
    const category = this._getCategoryById(transaction.idCategory)
    if (!category || !transaction) return ''

    this._lastMonth = getMonthName(transaction.updatedAt)

    if (transaction.idOrder) {
      const order = await orderRepository.getById(transaction.idOrder)

      if (!order) return ''

      return html`
        <a class="v-transaction__card" href="${this._getOrderViewRoute(transaction)}">
          <c-card-simple
            type=${category.name}
            name=${order.name}
            platform=${order.payment}
            date=${transaction.createdAt}
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
          date=${transaction.createdAt}
          money="${category.type === 'expense' ? '-' : ''}${transaction.amount}"
          icon=${category.icon}
          color=${category.color}
        ></c-card-simple>
      </a>
    `
  }

  /********************************/
  /************ ROUTES ************/
  /********************************/
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