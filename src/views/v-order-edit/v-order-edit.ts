import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'

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

  @state() _formscheme = OrderFormScheme

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
            .scheme=${this._formscheme}
          ></c-form>
          <div class="v-order-edit__actions">
            <e-button class="v-order-edit__button" size="full" @click=${this._goToOrderView}>cancelar</e-button>
            <e-button class="v-order-edit__button" size="full" @click=${this._editOrder}>Guardar</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private _setFormData(order: Order) {
    this._formscheme.id.fillValue = order.id
    this._formscheme.idStatus.fillValue = order.idStatus
    this._formscheme.name.fillValue = order.name
    this._formscheme.whatsapp.fillValue = order.whatsapp
    this._formscheme.wallapop.fillValue = order.wallapop
    this._formscheme.vinted.fillValue = order.vinted
    this._formscheme.instagram.fillValue = order.instagram
    this._formscheme.finalPrice.fillValue = order.finalPrice
    this._formscheme.address.fillValue = order.address
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
    const newscheme = window.structuredClone(this._formscheme)
    const idStatus = newscheme.idStatus as FieldScheme

    idStatus.options = await this._getStatusOptions()

    this._formscheme = newscheme
  }

  private async _editOrder() {
    const data = this.form.getFinalData()

    if (data) {
      await orderRepository.update(this.urlParams.id, data)

      this._goToOrderView()
    }
  }

  private _goToOrderView() {
    location.href = this.routerController.getAdminRoute('orderView', { id: this.urlParams.id })
  }
}