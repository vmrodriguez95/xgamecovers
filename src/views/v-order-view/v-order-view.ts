import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { until } from 'lit/directives/until.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { designRepository } from '../../domain/design/design.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { versionRepository } from '../../domain/version/version.repository.ts'
import { orderItemRepository } from '../../domain/order-item/order-item.repository.ts'

// Types
import { Order } from '../../domain/order/order.types.ts'
import { Design } from '../../domain/design/design.types.ts'
import { Status } from '../../domain/status/status.types.ts'
import { Version } from '../../domain/version/version.types.ts'
import { URLParam } from '../../domain/generic/generic.types.ts'
import { OrderItem } from '../../domain/order-item/order-item.types.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

//Controllers
import { RouterController } from '../../controllers/router.controller.ts'
import { ConfirmController } from '../../controllers/confirm.controller.ts'
import { DragAndDropController } from '../../controllers/drag-and-drop.controller.ts'

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

  @state() _showModal = false

  @state() _orderStatus: Status | null = null

  @state() _selectedDesign: Design | null = null

  @state() _selectedOrderItem: OrderItem | null = null

  _routerController = new RouterController(this)

  _ddController = new DragAndDropController(this)

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
            <a class="v-order-view__button" href=${this._getURLBack()}>
              <e-icon icon="arrow-left"></e-icon>
            </a>
            ${when(authStore.isLogged() && this._order, () => html`
              <a class="v-order-view__button" href=${this._getOrderEditURL()}>
                <e-icon icon="edit"></e-icon>
              </a>
              <button class="v-order-view__button" @click=${this._deleteHandler}>
                <e-icon icon="delete"></e-icon>
              </button>
            `)}
          </div>
          ${when(this._order, () => html`
            <a class="v-order-view__head" href=${this._getOrderEditURL()}>
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
              <e-icon icon="controller"></e-icon> ${this._order?.totalItems}
            </div>
            <div class="v-order-view__pill">
              <e-icon icon="credit-card"></e-icon> ${this._calculateTotalPrice()}€
            </div>
            <div class="v-order-view__pill">
              <e-icon icon="truck"></e-icon> ${this._order?.delivery}€
            </div>
            <div class="v-order-view__status">
              <e-button @click=${this._openModal} color=${this._orderStatus?.color} size="small">
                ${this._orderStatus?.name}
              </e-button>
            </div>
            <div class="v-order-view__add">
              <a href="${this._getOrderItemAddURL()}">
                <e-button icon="add"><e-icon icon="add"></e-icon></e-button>
              </a>
            </div>
          `)}
          <div class="v-order-view__designs">
            ${when(this._designs.length > 0,
              () => map(this._designs, (design: OrderItem) => html`
                <a
                  class="v-order-view__design"
                  href=${this.getOrderItemEditURL(design.id)}
                  @mousedown=${(event: MouseEvent) => this._ddController.onStart(event)}
                  @touchstart=${(event: TouchEvent) => this._ddController.onStart(event)}
                  @mousemove=${(event: MouseEvent) => this._ddController.onMove(event)}
                  @touchmove=${(event: TouchEvent) => this._ddController.onMove(event)}
                  @mouseup=${() => this._ddController.onEnd()}
                  @touchend=${() => this._ddController.onEnd()}
                  @trigger=${(event: Event) => this._deleteDesignHandler(design, event)}
                >
                  ${until(this._printDesign(design))}
                  <div class="v-order-view__delete is-sibling-draggable">
                    <e-icon icon="delete" size="xl"></e-icon>
                  </div>
                </a>
              `)
            )}
          </div>
        </div>
        ${when(this._showModal && this._order && !this._selectedDesign, () => this._getOrderStatusModal())}
        ${when(this._showModal && this._order && this._selectedDesign, () => this._getOrderItemStatusModal())}
      `,
      this.heading
    )
  }

  private async _loadOrderData() {
    this._order = await orderRepository.getById(this.urlParams.id)
  }

  private async _loadStatus() {
    this._status = await statusRepository.getAll()
    this._orderStatus = this._getStatusById(this._order)
  }

  private _getStatusById(order: Order | null) {
    if (!order) return null

    return this._status.find((status: Status) => status.id === order.idStatus) ?? null
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
    return await designRepository.getById(idDesign)
  }

  private async _loadVersions() {
    this._versions = await versionRepository.getAll()
  }

  private _getVersionItemById(idVersion: string) {
    return this._versions.find((version: Version) => version.id === idVersion)
  }

  private async _deleteDesign(idDesign: string) {
    await orderItemRepository.delete(idDesign)
  }

  private async _deleteDesignsByOrder(idOrder: string) {
    await orderItemRepository.deleteByOrder(idOrder)
  }

  private async _deleteOrder(idOrder: string) {
    await orderRepository.delete(idOrder)
  }

  private async _decreaseOrderItemCounter() {
    const order = await orderRepository.getById(this._order?.id || '')

    if (!order) return

    order.totalItems = order.totalItems - 1

    await orderRepository.update(order.id, order)
  }

  private _startDeleteAnimation(design: HTMLElement) {
    design.classList.add('is-deleting')

    setTimeout(() => {
      design.remove()
    }, 300)
  }

  private async _deleteDesignHandler(design: OrderItem, event: Event) {
    if (!design) return
    const designEl = event.currentTarget as HTMLElement

    const userChoise = await this._confirmController.confirm('¿Realmente quieres eliminar el diseño?')
    if (!userChoise) {
      this._ddController.reset()
      return
    }

    await this._deleteDesign(design.id)
    await this._decreaseOrderItemCounter()

    this._startDeleteAnimation(designEl)
  }

  private async _deleteHandler() {
    if (!this._order) return

    const userChoise = await this._confirmController.confirm('¿Realmente quieres eliminar el pedido?')
    if (!userChoise) return

    const idOrder = this._order.id    
    await this._deleteOrder(idOrder)
    await this._deleteDesignsByOrder(idOrder)

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
  
  private _getOrderEditURL() {
    return this._routerController.getAdminRoute('orderEdit', { id: this._order?.id })
  }
  
  private _getOrderItemAddURL() {
    return this._routerController.getAdminRoute('orderItem', { idOrder: this._order?.id })
  }

  private getOrderItemEditURL(idDesign: string) {
    return this._routerController.getAdminRoute('orderItemEdit', { idOrder: this.urlParams.id, idOrderItem: idDesign })
  }

  private _getURLBack() {
    return this._routerController.getAdminRoute('order', {})
  }

  private _goBack() {
    location.href = this._getURLBack()
  }

  private async _printDesign(designInOrder: OrderItem) {
    const design = await this._getDesignById(designInOrder.idDesign)
    const version = this._getVersionItemById(designInOrder.idVersion)

    if (!design || !version) return

    return html`
      <c-card-design
        class="v-order-view__design-item is-draggable"
        name=${design.name}
        version=${version.name}
        combination=${designInOrder.combination}
        money=${designInOrder.price}
        poster=${design.poster}
        .status=${this._getStatusItemById(designInOrder.idStatus)}
        @changeStatus=${(ev: CustomEvent) => this._changeDesignStatusHandler(ev, design, designInOrder)}
      ></c-card-design>
    `
  }

  private _openModal() {
    this._showModal = true
  }

  private _closeModal() {
    this._showModal = false
    this._selectedDesign = null
    this._selectedOrderItem = null
  }

  private _changeDesignStatusHandler(ev: CustomEvent, design: Design, designInOrder: OrderItem) {
    ev.preventDefault()
    ev.stopPropagation()

    this._selectedDesign = design
    this._selectedOrderItem = designInOrder
    this._openModal()
  }

  private async _changeStatusToOrderItem(item: OrderItem | null, status: Status) {
    if (!item) return

    item.idStatus = status.id
    await orderItemRepository.update(item.id, { idStatus: status.id })

    this._closeModal()
  }

  private async _changeStatusToOrder(status: Status) {
    if (!this._order) return

    this._orderStatus = status
    this._order.idStatus = status.id
    await orderRepository.update(this._order?.id || '', { idStatus: status.id })

    this._closeModal()
    this.requestUpdate()
  }

  private _getOrderStatusModal() {
    return html`
      <c-modal @close=${this._closeModal}>
        <div class="v-order-view__modal">
          <div class="v-order-view__avatar v-order-view__avatar--${this._getStatusById(this._order)?.color}">
            <e-icon icon="person-rounded" size="xxl"></e-icon>
          </div>
          <p class="v-order-view__text">${this._order?.name}</p>
          ${map(this._status, (status: Status) => html`
            <e-button
              class="v-order-view__button-status"
              color=${status.color}
              size="full"
              @click=${() => this._changeStatusToOrder(status)}
            >${status.name}</e-button>
          `)}
        </div>
      </c-modal>
    `
  }

  private _getOrderItemStatusModal() {
    if (!this._selectedDesign || !this._selectedOrderItem) return

    return html`
      <c-modal @close=${this._closeModal}>
        <div class="v-order-view__modal">
          <img class="v-order-view__image" src=${this._selectedDesign.poster} alt="${this._selectedDesign.name} poster" width="72" height="72" />
          <p class="v-order-view__text">${this._order?.name}</p>
          ${map(this._itemStatus, (status: Status) => html`
            <e-button
              class="v-order-view__button-status"
              color=${status.color}
              size="full"
              @click=${() => this._changeStatusToOrderItem(this._selectedOrderItem, status)}
            >${status.name}</e-button>
          `)}
        </div>
      </c-modal>
    `
  }
}