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
import type { Status } from '../../domain/status/status.types.ts'
import type { Client } from '../../domain/client/client.types.ts'
import type { FieldScheme } from '../../domain/form/form.types.ts'

// Factory
import { ClientFactory } from '../../domain/client/client.factory.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

//Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-order-new.style.scss?inline'

@customElement('v-order-new')
class VOrderNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _formScheme = OrderFormScheme

  @query('c-form') form!: HTMLFormElement

  routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    super.connectedCallback()
    
    await this._fillStatusOptions()
    await this._fillClientOptions()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order-new">
          <c-form
            class="v-order-new__form"
            .scheme=${this._formScheme}
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

  private async _getStatusOptions() {
    const allStatus = await statusRepository.getAll()

    return allStatus.map((status: Status) => ({
      value: status.id,
      name: status.name
    }))
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

  private async _createOrder() {
    const data = this.form.getFinalData()
    if (!data) return null

    if (data.idClient === '' && data.name !== '') {
      const client = this._getNewClientValues(data)
      const newIdClient = await clientRepository.create(client)

      data.idClient = newIdClient
    }

    this._removeClientFields(data)

    const newIdOrder = await orderRepository.create(data)
    if (!newIdOrder) return null

    await transactionRepository.saveByIdOrder(newIdOrder, { amount: data.finalPrice, idOrderStatus: data.idStatus })
    this._goToEdit(newIdOrder)
  }

  private _goToEdit(idOrder: string) {
    location.href = this.routerController.getAdminRoute('orderView', { id: idOrder })
  }

  private _getURLBack() {
    return this.routerController.getAdminRoute('order', {})
  }
}