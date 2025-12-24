import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import { Order } from '../../domain/order/order.types.ts'
import { Status } from '../../domain/status/status.types.ts'

// Repository
import { orderRepository } from '../../domain/order/order.repository.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-order.style.scss?inline'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { when } from 'lit/directives/when'

@customElement('v-order')
class VOrder extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _orders: Order[] = []

  @state() _queryOrders: Order[] = []

  @state() _status: Status[] = []

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback() {
    super.connectedCallback()

    this._loadStatus()
    this._loadOrders()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order">
          <div class="v-order__head">
            <c-search class="v-order__search" @search=${this._searchHandler}></c-search>
            <a href=${this._getCreatetUrl()}>
              <e-button><e-icon icon="add"></e-icon></e-button>
            </a>
          </div>
          ${map(this._queryOrders, (order: Order) => html`
            <a href=${this._getEditUrl(order.id)} class="v-order__card">
              <c-card-order
                .status=${this._getStatusById(order.idStatus)}
                name=${order.name}
                date=${order.createdAt}
                money=${order.finalPrice}
                .rrss=${this._getRRSS(order)}
                totalItems=${order.totalItems}
              ></c-card-order>
            </a>
          `)}
        </div>
      `,
      this.heading
    )
  }

  private async _loadOrders() {
    const orders = await orderRepository.getAllOrderedByDate()

    this._orders = orders
    this._queryOrders = orders
  }

  private async _loadStatus() {
    this._status = await statusRepository.getAll()
  }

  private _getStatusById(idStatus: string) {
    return this._status.find((status: Status) => status.id === idStatus)
  }

  private _getRRSS(order: Order) {
    return [
      { logo: 'whatsapp', name: order.whatsapp },
      { logo: 'instagram', name: order.instagram },
      { logo: 'vinted', name: order.vinted },
      { logo: 'wallapop', name: order.wallapop }
    ]
  }

  private _getEditUrl(idOrder: string) {
    return this._routerController.getAdminRoute('orderView', { id: idOrder })
  }

  private _getCreatetUrl() {
    return this._routerController.getAdminRoute('orderNew', {})
  }

  private _searchHandler(e: CustomEvent) {
    const query = e.detail

    this._queryOrders = this._orders.filter((order) => order.name.toLowerCase().includes(query.toLowerCase()))
  }
}