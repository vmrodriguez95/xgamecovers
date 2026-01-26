import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { clientRepository } from '../../domain/client/client.repository.ts'
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'

// Domain
import { OrderFormScheme } from '../../domain/order/order.form.ts'

// Types
import type { Order } from '../../domain/order/order.types.ts'
import type { Status } from '../../domain/status/status.types.ts'
import type { Client } from '../../domain/client/client.types.ts'
import type { FieldScheme } from '../../domain/form/form.types.ts'
import type { URLParam } from '../../domain/generic/generic.types.ts'

// Factory
import { ClientFactory } from '../../domain/client/client.factory.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

//Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-order-edit.style.scss?inline'

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
    await this._loadOrderData()
    await this._fillClientOptions()
    await this._fillStatusOptions()
    
    super.connectedCallback()
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

  private async _getClientsAsOptions() {
      const allClients = await clientRepository.getAll()
  
      return allClients.map((client: Client) => ({
        value: client.id,
        name: client.name
      }))
    }
  
    private async _fillClientOptions() {
      const newscheme = window.structuredClone(this._formScheme)
      const idClient = newscheme.idClient as FieldScheme
  
      idClient.options = await this._getClientsAsOptions()
  
      this._formScheme = newscheme
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
    const newScheme = window.structuredClone(this._formScheme)
    const idStatus = newScheme.idStatus as FieldScheme

    idStatus.options = await this._getStatusOptions()

    this._formScheme = newScheme
  }

  private _getNewClientValues(data: Client) {
    const newClient = ClientFactory.createEmpty()
    const clientKeys = Object.keys(newClient) as (keyof Client)[]

    clientKeys.forEach((key) => {
      newClient[key] = data[key]
    })

    return newClient
  }

  private _removeClientFields(data: Client) {
    const clientExample = ClientFactory.createEmpty()
    const clientKeys = Object.keys(clientExample) as (keyof Client)[]

    clientKeys.forEach((key) => {
      delete data[key]
    })
  }

  private async _editOrder() {
    const data = this.form.getFinalData()

    if (!data || !this._order) return

    if (data.idClient === '' && data.name !== '') {
      const client = this._getNewClientValues(data)
      const newIdClient = await clientRepository.create(client)

      data.idClient = newIdClient
    }

    this._removeClientFields(data)

    const idOrder = this._order.id
    await orderRepository.update(idOrder, data)
    await transactionRepository.updateByIdOrder(idOrder, { amount: data.finalPrice, idOrderStatus: data.idStatus })

    this._goToOrderView()
  }

  private _getOrderViewUrl() {
    return this.routerController.getAdminRoute('orderView', { id: this._order?.id })
  }

  private _goToOrderView() {
    location.href = this._getOrderViewUrl()
  }
}