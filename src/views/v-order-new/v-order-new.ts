import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'

// Domain
import { OrderFormScheme } from '../../domain/order/order.form.ts'

// Types
import { FieldScheme } from '../../domain/form/form.types.ts'
import { Status } from '../../domain/status/status.types.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

//Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-order-new.style.scss?inline'

@customElement('v-order-new')
class VOrderNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _formscheme = OrderFormScheme

  @query('c-form') form!: HTMLFormElement

  routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()
    
    this._fillStatusOptions()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order-new">
          <c-form
            class="v-order-new__form"
            .scheme=${this._formscheme}
          ></c-form>
          <div class="v-order-new__actions">
            <e-button class="v-order-new__button" @click=${this._goBack}>cancelar</e-button>
            <e-button class="v-order-new__button" @click=${this._createOrder}>Crear</e-button>
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

  private async _fillStatusOptions() {
    const newscheme = window.structuredClone(this._formscheme)
    const idStatus = newscheme.idStatus as FieldScheme

    idStatus.options = await this._getStatusOptions()

    this._formscheme = newscheme
  }

  private async _createOrder() {
    const data = this.form.getFinalData()

    if (data) {
      const newIdOrder = await orderRepository.create(data)

      if (newIdOrder) {
        this._goToEdit(newIdOrder)
      }
    }
  }

  private _goToEdit(idOrder: string) {
    location.href = this.routerController.getAdminRoute('orderEdit', { id: idOrder })
  }

  private _goBack() {
    location.href = this.routerController.getAdminRoute('order', {})
  }
}