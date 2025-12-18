import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import { Option } from '../../domain/form/form.types.ts'
import { Status } from '../../domain/status/status.types.ts'
import { EButton } from '../../elements/e-button/e-button.ts'
import { Version } from '../../domain/version/version.types.ts'
import { Console } from '../../domain/console/console.types.ts'
import { URLParam } from '../../domain/generic/generic.types.ts'
import { Design } from '../../domain/catalogue/catalogue.types.ts'
import { OrderItem } from '../../domain/order-item/order-item.types.ts'

// Repository
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'
import { versionRepository } from '../../domain/version/version.repository.ts'
import { consoleRepository } from '../../domain/console/console.repository.ts'
import { orderItemRepository } from '../../domain/order-item/order-item.repository.ts'
import { catalogueDesignRepository } from '../../domain/catalogue/catalogue.repository.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Form
import { OrderItemFormScheme } from '../../domain/order-item/order-item.form.ts'

// Styles
import style from './v-order-item-edit.style.scss?inline'

@customElement('v-order-item-edit')
class VOrderItemEdit extends LayoutMixin(LitElement) {

  @property({ type: Object }) heading: string = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _formScheme = OrderItemFormScheme

  @state() _orderItem: OrderItem | null = null

  @state() _design: Design | null = null

  @query('c-form') _form!: HTMLFormElement

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    super.connectedCallback()

    await this._loadOrderItemData()
    await this._loadDesign()
    await this._prepareForm()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-order-item-edit">
        <c-form
          class="v-order-item-edit__form"
          .scheme=${this._formScheme}
        ></c-form>
        <div class="v-order-item-edit__actions">
          <e-button class="v-order-item-edit__button" size="full" @click=${this._goBack}>Cancelar</e-button>
          <e-button class="v-order-item-edit__button" size="full" @click=${this._editHandler}>Editar</e-button>
        </div>
      </div>
    `, this.heading)
  }

  /*
   Methods
   */
  private async _loadOrderItemData() {
    if (!this.urlParams.idOrderItem) return

    this._orderItem = await orderItemRepository.getById(this.urlParams.idOrderItem)
  }

  private async _loadDesign() {
    if (!this._orderItem) return

    this._design = await catalogueDesignRepository.getById(this._orderItem.idDesign)
  }

  private async _getConsolesAsOptions(): Promise<Option[]> {
    const consoles = await consoleRepository.getAll()

    return consoles.map((console: Console) => ({ value: console.id, name: console.name }))
  }

  private async _getVersionsAsOptions(): Promise<Record<string, Option[]>> {
    const options = {} as Record<string, Option[]>
    const versions = await versionRepository.getAll()

    versions.forEach((version: Version) => {
      if (!options[version.idConsole]) options[version.idConsole] = []

      options[version.idConsole].push({
        name: version.name,
        value: version.id
      })
    })

    return options
  }

  private async _getStatusAsOptions(): Promise<Option[]> {
    const status = await statusRepository.getAllItems()

    return status.map((status: Status) => ({ value: status.id, name: status.name }))
  }

  private _fillFormWithValues(orderItem: OrderItem) {
    (Object.keys(orderItem) as Array<keyof OrderItem>).forEach((key) => {
      if (this._formScheme[key]) {
        this._formScheme[key].fillValue = orderItem[key]
      }
    })
  } 

  private async _prepareForm() {
    if (!this._orderItem || !this._design) return

    this._fillFormWithValues(this._orderItem)

    const newScheme = window.structuredClone(this._formScheme)
    const { idOrder, idDesign, idConsole, idVersion, idStatus } = newScheme
    const [ consoles, versions, status ] = await Promise.all([
      this._getConsolesAsOptions(),
      this._getVersionsAsOptions(),
      this._getStatusAsOptions()
    ])

    idOrder.fillValue = this.urlParams.idOrder

    if ('options' in idStatus) idStatus.options = status
    if ('options' in idDesign) idDesign.options = [{ value: this._design.id, name: this._design.name, logo: this._design.poster, color: '' }]
    if ('options' in idConsole) idConsole.options = consoles
    if ('additionalData' in idVersion) idVersion.additionalData = versions

    this._formScheme = newScheme
  }

  private async _incrementOrderItemCounter() {
    const order = await orderRepository.getById(this.urlParams.idOrder || '')

    if (!order) return

    order.totalItems = order.totalItems + 1

    await orderRepository.update(order.id, order)
  }

  private async _editHandler(ev: Event) {
    const button = ev.currentTarget as EButton
    button.loading = true

    const data = this._form.getFinalData()
    if (!data || !this._orderItem) return

    await orderItemRepository.update(this._orderItem.id, data)
    await this._incrementOrderItemCounter()
    this._goBack()

    button.loading = false
  }

  private _goBack() {
    location.href = this._routerController.getAdminRoute('orderView', { id: this.urlParams.idOrder })
  }
}