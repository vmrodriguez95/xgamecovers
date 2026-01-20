import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'
import { transactionCategoryRepository } from '../../domain/transaction-category/transaction-category.repository.ts'

// Domain
import { OrderFormScheme } from '../../domain/order/order.form.ts'

// Types
import type { Order } from '../../domain/order/order.types.ts'
import type { Status } from '../../domain/status/status.types.ts'
import type { FieldScheme } from '../../domain/form/form.types.ts'
import type { TransactionCategory } from '../../domain/transaction-category/transaction-category.types.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

//Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-order-new.style.scss?inline'
import { Transaction } from '../../domain/transaction/transaction.types.ts'

@customElement('v-order-new')
class VOrderNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _formscheme = OrderFormScheme

  @query('c-form') form!: HTMLFormElement

  _transactionCategories: TransactionCategory[] = []

  routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()
    
    this._fillStatusOptions()
    this._loadTransactionCategories()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order-new">
          <c-form
            class="v-order-new__form"
            .scheme=${this._formscheme}
          ></c-form>
          <div class="v-order-new__actions">
            <a href="${this._getURLBack()}">
              <e-button size="full">cancelar</e-button>
            </a>
            <e-button size="full" @click=${this._createOrder}>Crear</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private async _loadTransactionCategories() {
    this._transactionCategories = await transactionCategoryRepository.getAll()
  }

  private async _getStatusOptions() {
    const allStatus = await statusRepository.getAll()

    return allStatus.map((status: Status) => ({
      value: status.id,
      name: status.name
    }))
  }

  private async _fillStatusOptions() {
    const newscheme = window.structuredClone(this._formscheme)
    const idStatus = newscheme.idStatus as FieldScheme

    idStatus.options = await this._getStatusOptions()

    this._formscheme = newscheme
  }

  private _getIncomeCategory() {
    return this._transactionCategories.find((category: TransactionCategory) => category.type === 'income')
  }

  private async _createTransaction(newOrder: Order, idOrder: string) {
    const newTransaction = {} as Transaction

    newTransaction.idOrder = idOrder
    newTransaction.amount = newOrder.finalPrice
    newTransaction.idCategory = this._getIncomeCategory()!.id

    await transactionRepository.create(newTransaction)
  }

  private async _createOrder() {
    const data = this.form.getFinalData()

    if (data) {
      const newIdOrder = await orderRepository.create(data)

      if (newIdOrder) {
        await this._createTransaction(data, newIdOrder)
        this._goToEdit(newIdOrder)
      }
    }
  }

  private _goToEdit(idOrder: string) {
    location.href = this.routerController.getAdminRoute('orderView', { id: idOrder })
  }

  private _getURLBack() {
    return this.routerController.getAdminRoute('order', {})
  }
}