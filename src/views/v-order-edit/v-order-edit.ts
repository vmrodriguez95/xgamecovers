import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'

// Domain
import { OrderFormScheme } from '../../domain/order/order.form.ts'

// Types
import { Status } from '../../domain/status/status.types.ts'
import { FieldScheme } from '../../domain/form/form.types.ts'
import { URLParam } from '../../domain/generic/generic.types.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

//Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-order-edit.style.scss?inline'
import { Order } from '../../domain/order/order.types.ts'

@customElement('v-order-edit')
class VOrderNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _formScheme = OrderFormScheme

  @query('c-form') form!: HTMLFormElement

  @state() _order: Order | null = null

  routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    super.connectedCallback()
    
    await this._loadOrderData()
    await this._fillStatusOptions()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order-edit">
          <c-form
            class="v-order-edit__form"
            .scheme=${this._formScheme}
          ></c-form>
          <div class="v-order-edit__actions">
            <a href="${this._getOrderViewUrl()}">
              <e-button size="full">cancelar</e-button>
            </a>
            <e-button size="full" @click=${this._editOrder}>Guardar</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private _setFormData(order: Order) {
    (Object.keys(order) as Array<keyof Order>).forEach((key) => {
      if (this._formScheme[key]) {
        this._formScheme[key].fillValue = order[key]
      }
    })
  }

  private async _loadOrderData() {
    const order = await orderRepository.getById(this.urlParams.id)

    if (order) {
      this._setFormData(order)
      this._order = order
    }
  }

  private async _getStatusOptions() {
    const allStatus = await statusRepository.getAll()

    return allStatus.map((status: Status) => ({
      value: status.id,
      name: status.name
    }))
  }

  private async _fillStatusOptions() {
    const newscheme = window.structuredClone(this._formScheme)
    const idStatus = newscheme.idStatus as FieldScheme

    idStatus.options = await this._getStatusOptions()

    this._formScheme = newscheme
  }

  private async _editOrder() {
    const data = this.form.getFinalData()

    if (data && this._order) {
      const idOrder = this._order.id
      await orderRepository.update(idOrder, data)
      await transactionRepository.updateByIdOrder(idOrder, { amount: data.finalPrice, idOrderStatus: data.idStatus })

      this._goToOrderView()
    }
  }

  private _getOrderViewUrl() {
    return this.routerController.getAdminRoute('orderView', { id: this._order?.id })
  }

  private _goToOrderView() {
    location.href = this._getOrderViewUrl()
  }
}