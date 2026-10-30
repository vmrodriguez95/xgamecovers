import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import type { Order } from '../../domain/order/order.types.ts'
import type { Status } from '../../domain/status/status.types.ts'
import type { Client } from '../../domain/client/client.types.ts'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { clientRepository } from '../../domain/client/client.repository.ts'
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-order.style.scss?inline'

@customElement('v-order')
class VOrder extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _orders: Order[] = []

  @state() _clients: Client[] = []

  @state() _queryOrders: Order[] = []

  @state() _status: Status[] = []

  @state() _showModal = false

  @state() _selectedOrder: Order | null = null

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback() {
    super.connectedCallback()

    this._loadStatus()
    this._loadClients()
    this._loadOrders()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order">
          <div class="v-order__head">
            <c-search
              class="v-order__search"
              placeholder="Buscar pedido"
              @search=${this._searchHandler}
            ></c-search>
            <a href=${this._getCreatetUrl()}>
              <e-button><e-icon icon="add"></e-icon></e-button>
            </a>
          </div>
          ${map(this._queryOrders, (order: Order) => html`
            <a href=${this._getEditUrl(order.id)} class="v-order__card">
              ${this._printOrder(order)}
            </a>
          `)}
        </div>
        ${when(this._showModal && this._selectedOrder, () => html`
          <c-modal @close=${this._closeModal}>
            <div class="v-order__modal">
              <div class="v-order__avatar v-order__avatar--${this._getStatusById(this._selectedOrder)?.color}">
                <e-icon icon="person-rounded" size="xxl"></e-icon>
              </div>
              <p class="v-order__text">${this._getClientById(this._selectedOrder?.idClient || '')?.name}</p>
              ${map(this._status, (status: Status) => html`
                <e-button
                  class="v-order__button"
                  color=${status.color}
                  size="full"
                  @click=${() => this._changeStatusToOrder(this._selectedOrder, status)}
                >${status.name}</e-button>
              `)}
            </div>
          </c-modal>
        `)}
      `,
      this.heading
    )
  }

  private _setSelectedOrder(order: Order | null) {
    this._selectedOrder = order
  }

  private async _loadOrders() {
    const orders = await orderRepository.getAll()

    this._orders = orders
    this._queryOrders = orders
  }

  private async _loadClients() {
    const clients = await clientRepository.getAll()

    this._clients = clients
  }

  private async _loadStatus() {
    this._status = await statusRepository.getAll()
  }

  private _getStatusById(order: Order | null) {
    if (!order) return

    return this._status.find((status: Status) => status.id === order.idStatus)
  }

  private _getClientById(idClient: string) {
    return this._clients.find((client: Client) => client.id === idClient)
  }

  private _getRRSS(client: Client) {
    return [
      { logo: 'whatsapp', name: client.whatsapp },
      { logo: 'instagram', name: client.instagram },
      { logo: 'vinted', name: client.vinted },
      { logo: 'wallapop', name: client.wallapop }
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

    this._queryOrders = this._orders.filter((order) => {
      const client = this._getClientById(order.idClient)

      if (!client) return false

      return client.name.toLowerCase().includes(query.toLowerCase())
    })
  }

  private async _changeStatusToOrder(order: Order | null, status: Status) {
    if (!order) return

    order.idStatus = status.id
    await orderRepository.update(order.id, { idStatus: status.id })
    await transactionRepository.saveByIdOrder(order.id, { idOrderStatus: status.id, amount: order.finalPrice })

    this._closeModal()
  }

  private _changeStatusHandler(ev: Event, order: Order) {
    ev.preventDefault()
    ev.stopPropagation()

    this._setSelectedOrder(order)
    this._openModal()
  }

  private _openModal() {
    this._showModal = true
  }

  private _closeModal() {
    this._showModal = false
    this._setSelectedOrder(null)
  }

  private _printOrder(order: Order) {
    const client = this._getClientById(order.idClient)

    if (!client) return ''

    return html`
    <c-card-order
      .status=${this._getStatusById(order)}
      name=${client.name}
      date=${order.createdAt}
      money=${order.finalPrice}
      .rrss=${this._getRRSS(client)}
      totalItems=${order.totalItems}
      @changeStatus=${(ev: Event) => this._changeStatusHandler(ev, order)}
    ></c-card-order>
    `
  }
}