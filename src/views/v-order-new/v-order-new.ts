import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

// BBDD
import { statusRepository } from '../../domain/status/status.repository.ts'

// Domain
import { OrderFormSchema } from '../../domain/order/order.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Styles
import style from './v-order-new.style.scss?inline'
import { Status } from '../../domain/status/status.types.ts'
import { Option } from '../../domain/form/form.types.ts'

@customElement('v-order-new')
class VOrderNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @property({ type: String }) entity = ''

  @state() _formSchema = OrderFormSchema

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()
    
    this.fillStatusOptions()
  }

  render() {
    return this.layoutGrid(
      this.heading,
      html`
        <div class="v-order-new">
          <c-form
            class="v-order-new__form"
            .schema=${this._formSchema}
          ></c-form>
        </div>
      `
    )
  }

  async fillStatusOptions() {
    const allStatus = await statusRepository.getAll()
    const newSchema = window.structuredClone(this._formSchema)

    const options: Option[] = allStatus.map((status: Status) => {
      return {
        value: status.id.toString(),
        name: status.name
      }
    })

    newSchema.idStatus.options = options

    this._formSchema = newSchema
  }
}