import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { until } from 'lit/directives/until.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { versionRepository } from '../../domain/version/version.repository.ts'
import { orderItemRepository } from '../../domain/order-item/order-item.repository.ts'
import { catalogueDesignRepository } from '../../domain/catalogue/catalogue.repository.ts'

// Types
import { Order } from '../../domain/order/order.types.ts'
import { Status } from '../../domain/status/status.types.ts'
import { Version } from '../../domain/version/version.types.ts'
import { URLParam } from '../../domain/generic/generic.types.ts'
import { OrderItem } from '../../domain/order-item/order-item.types.ts'

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

  @state() _versions: Version[] = []

  @state() _status: Status[] = []

  @state() _itemStatus: Status[] = []

  _orderStatus: Status | undefined

  _routerController = new RouterController(this)

  _confirmController = new ConfirmController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback() {
    super.connectedCallback()
    
    this._loadOrderData()
    this._loadStatus()
    this._loadItemStatus()
    this._loadDesigns()
    this._loadVersions()
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
              date=${this._order?.createdAt}
              .rrss=${this._getRRSS(this._order)}
              totalItems=${this._order?.totalItems}
            ></c-card-order>
          </a>
          ${when(this._order?.address, () => html`
            <div class="v-order-view__address">
              <e-icon icon="location"></e-icon> ${this._order?.address}
            </div>
          `)}
          <div class="v-order-view__pill">
            <e-icon icon="controller"></e-icon> ${this._designs?.length}
          </div>
          <div class="v-order-view__pill">
            <e-icon icon="credit-card"></e-icon> ${this._calculateTotalPrice()}€
          </div>
          <div class="v-order-view__pill">
            <e-icon icon="truck"></e-icon> ${this._order?.delivery}€
          </div>
          <div class="v-order-view__status v-order-view__status--${this._orderStatus?.color}">
            ${this._orderStatus?.name}
          </div>
          <a class="v-order-view__add" href="${this._goToAddOrderItem()}">
            <e-button icon="add">
              <e-icon icon="add"></e-icon>
            </e-button>
          </a>
          ${when(this._designs.length > 0,
            () => map(this._designs, (design: OrderItem) =>
              until(this._printDesign(design))
            )
          )}
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
    this._orderStatus = this._getStatusById(this._order?.idStatus || '')
  }

  private _getStatusById(idStatus: string) {
    return this._status.find((status: Status) => status.id === idStatus)
  }

  private async _loadItemStatus() {
    const status = await statusRepository.getAllItems()

    this._itemStatus = status
  }

  private _getStatusItemById(idStatus: string) {
    return this._itemStatus.find((status: Status) => status.id === idStatus)
  }

  private async _loadDesigns() {
    this._designs = await orderItemRepository.getAllByIdOrder(this.urlParams.id)
  }
  
  private async _getDesignById(idDesign: string) {
    return await catalogueDesignRepository.getById(idDesign)
  }

  private async _loadVersions() {
    this._versions = await versionRepository.getAll()
  }

  private _getVersionItemById(idVersion: string) {
    return this._versions.find((version: Version) => version.id === idVersion)
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
    return this._designs.reduce((acc, design) => acc + design.price, 0)
  }

  private _calculateDiscount() {
    return 0
  }

  private _goBack() {
    location.href = this._routerController.getAdminRoute('order', {})
  }

  private _goToAddOrderItem() {
    return this._routerController.getAdminRoute('orderItem', { idOrder: this._order?.id })
  }

  private async _printDesign(designInOrder: OrderItem) {
    const design = await this._getDesignById(designInOrder.idDesign)
    const version = this._getVersionItemById(designInOrder.idVersion)

    return html`
      <c-card-design
        class="v-order-view__design"
        name=${design?.name}
        version=${version?.name}
        combination=${designInOrder.combination}
        money=${designInOrder.price}
        poster=${design?.poster}
        .status=${this._getStatusItemById(designInOrder.idStatus)}
      ></c-card-design>
    `
  }
}