import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'

// Types
import { URLParam } from '../../domain/generic/generic.types.ts'
import { Order, OrderItem } from '../../domain/order/order.types.ts'
import { Status, ItemStatus } from '../../domain/status/status.types.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

//Controllers
import { RouterController } from '../../controllers/router.controller.ts'
import { ConfirmController } from '../../controllers/confirm.controller.ts'

// Auth
import { authStore } from '../../domain/auth/auth.store.ts'

// Styles
import style from './v-order-view.style.scss?inline'

@customElement('v-order-view')
class VOrderView extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''
  
  @property({ type: Object }) urlParams!: URLParam

  @state() _order: Order | null = null

  @state() _designs: OrderItem[] = []

  @state() _status: Status[] = []

  @state() _itemStatus: ItemStatus[] = []

  _orderStatus: Status | undefined

  _routerController = new RouterController(this)

  _confirmController = new ConfirmController(this)

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    super.connectedCallback()
    
    await this._loadOrderData()
    await this._loadStatus()
    this._loadOrderStatus()
    await this._loadItemStatus()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order-view">
          <div class="v-order-view__actions">
            <a class="v-order-view__button" href=${this._routerController.getAdminRoute('order', {})}>
              <e-icon icon="arrow-left"></e-icon>
            </a>
            ${when(authStore.user && this._order, () => html`
              <a class="v-order-view__button" href=${this._routerController.getAdminRoute('orderEdit', { id: this._order?.id })}>
                <e-icon icon="edit"></e-icon>
              </a>
            `)}
            ${when(authStore.user && this._order, () => html`
              <button class="v-order-view__button" @click=${this._deleteHandler}>
                <e-icon icon="delete"></e-icon>
              </button>
            `)}
          </div>
          <a class="v-order-view__head" href=${this._routerController.getAdminRoute('orderEdit', { id: this._order?.id })}>
            <c-card-order
              .status=${this._orderStatus}
              name=${this._order?.name}
              money=${this._order?.finalPrice}
              hideStatus=${true}
              hideDesigns=${true}
              .rrss=${this._getRRSS(this._order)}
              totalItems=${this._order?.totalItems}
            ></c-card-order>
          </a>
          <div class="v-order-view__address">
            <e-icon icon="location"></e-icon> ${this._order?.address}
          </div>
          <div class="v-order-view__pill">
            <e-icon icon="controller"></e-icon> ${this._order?.totalItems}
          </div>
          <div class="v-order-view__pill">
            <e-icon icon="credit-card"></e-icon> ${this._calculateTotalPrice()}€
          </div>
          <div class="v-order-view__pill">
            <e-icon icon="discount"></e-icon> ${this._calculateDiscount()}%
          </div>
          <div class="v-order-view__status v-order-view__status--${this._orderStatus?.color}">
            ${this._orderStatus?.name}
          </div>
          ${map(this._designs, (design: OrderItem) => html`
            <p>Diseño</p>
          `)}
        </div>
      `,
      this.heading
    )
  }

  private async _loadOrderData() {
    this._order = await orderRepository.getById(this.urlParams.id)
  }

  private async _loadStatus() {
    this._status = await statusRepository.getAll()
  }

  private _loadOrderStatus() {
    this._orderStatus = this._status.find((status: Status) => status.id === this._order?.idStatus)
  }

  private async _loadItemStatus() {
    this._itemStatus = await statusRepository.getAllItems()
  }

  private async _removeOrder(idOrder: string) {
    await orderRepository.delete(idOrder)
  }

  private async _deleteHandler() {
    if (!this._order) return

    const idOrder = this._order.id
    const userChoise = await this._confirmController.confirm('¿Realmente quieres eliminar el pedido?')

    if (!userChoise) return

    await this._removeOrder(idOrder)

    this._goBack()
  }

  private _getRRSS(order: Order | null) {
    return [
      { logo: 'whatsapp', name: order?.whatsapp },
      { logo: 'instagram', name: order?.instagram },
      { logo: 'vinted', name: order?.vinted },
      { logo: 'wallapop', name: order?.wallapop }
    ]
  }

  private _calculateTotalPrice() {
    return 0
  }

  private _calculateDiscount() {
    return 0
  }

  private _goBack() {
    location.href = this._routerController.getAdminRoute('order', {})
  }
}