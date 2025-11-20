import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

// Domain
import { OrderFormSchema } from '../../domain/order/order.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Styles
import style from './v-order-new.style.scss?inline'

@customElement('v-order-new')
class VOrderNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @property({ type: String }) entity = ''

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(
      this.heading,
      html`
        <div class="v-order-new">
          <c-form
            class="v-order-new__form"
            .schema=${OrderFormSchema}
          ></c-form>
        </div>
      `
    )
  }
}