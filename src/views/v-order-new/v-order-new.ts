import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { orderRepository } from '../../domain/order/order.repository.ts'
import { statusRepository } from '../../domain/status/status.repository.ts'

// Domain
import { OrderFormSchema } from '../../domain/order/order.form.ts'

// Types
import { Option } from '../../domain/form/form.types.ts'
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

  @property({ type: String }) entity = ''

  @state() _formSchema = OrderFormSchema

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
            action="/order"
            class="v-order-new__form"
            .schema=${this._formSchema}
          ></c-form>
          <div class="v-order-new__actions">
            <e-button class="v-order-new__button" @click=${this._goBack}>cancelar</e-button>
            <e-button class="v-order-new__button" @click=${this.createOrder}>Crear</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private async _fillStatusOptions() {
    const allStatus = await statusRepository.getAll()
    const newSchema = window.structuredClone(this._formSchema)

    const options: Option[] = allStatus
      .map((status: Status) => {
        return {
          value: status.id,
          name: status.name
        }
      })

    newSchema.idStatus.options = options

    this._formSchema = newSchema
  }

  private createOrder() {
    const data = this.form.getFinalData()

    if (data) {
      orderRepository.create(data)
    }
  }

  private _goBack() {
    location.href = this.routerController.getAdminRoute('order', {})
  }
}