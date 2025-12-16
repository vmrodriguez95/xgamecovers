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

// Repository
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
import style from './v-order-item-add.style.scss?inline'

@customElement('v-order-item-add')
class VOrderItemAdd extends LayoutMixin(LitElement) {

  @property({ type: Object }) heading: string = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _formScheme = OrderItemFormScheme

  @query('c-form') _form!: HTMLFormElement

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback() {
    super.connectedCallback()

    this._prepareForm()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-order-item-add">
        <c-form
          class="v-order-item-add__form"
          .scheme=${this._formScheme}
        ></c-form>
        <div class="v-order-item-add__actions">
          <e-button class="v-order-item-add__button" size="full" @click=${this._goBack}>Cancelar</e-button>
          <e-button class="v-order-item-add__button" size="full" @click=${this._addHandler}>Añadir</e-button>
        </div>
      </div>
    `, this.heading)
  }

  /*
   Methods
   */
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

  private async _getDesignsAsOptions(): Promise<Option[]> {
    const { idGame } = this.urlParams

    if (!idGame) return []

    const designs = await catalogueDesignRepository.getDesignsByGame(idGame)

    return designs.map((design: Design) => ({ value: design.id, name: design.name, logo: design.slipcover }))
  }

  private async _prepareForm() {
    const newScheme = window.structuredClone(this._formScheme)
    const { idOrder, idDesign, idConsole, idVersion, idStatus } = newScheme
    const [ designs, consoles, versions, status ] = await Promise.all([
      this._getDesignsAsOptions(),
      this._getConsolesAsOptions(),
      this._getVersionsAsOptions(),
      this._getStatusAsOptions()
    ])

    idOrder.fillValue = this.urlParams.idOrder

    if ('options' in idStatus) idStatus.options = status
    if ('options' in idDesign) idDesign.options = designs
    if ('options' in idConsole) idConsole.options = consoles
    if ('additionalData' in idVersion) idVersion.additionalData = versions

    this._formScheme = newScheme
  }

  private async _addHandler(ev: Event) {
    const button = ev.currentTarget as EButton
    button.loading = true

    const data = this._form.getFinalData()
    if (!data) return

    const newIdOrderItem = await orderItemRepository.create(data)

    if (newIdOrderItem) {
      this._goBack()
    } else {
      button.loading = false
      throw new Error('No se ha podido añadir el diseño al pedido')
    }

    button.loading = false
  }

  private _goBack() {
    location.href = this._routerController.getAdminRoute('orderItem', { idOrder: this.urlParams.idOrder })
  }

  private _goToEditOrder() {
    location.href = this._routerController.getAdminRoute('orderView', { id: this.urlParams.idOrder })
  }
}