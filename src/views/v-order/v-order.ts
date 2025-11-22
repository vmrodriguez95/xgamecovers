import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Styles
import style from './v-order.style.scss?inline'

@customElement('v-order')
class VOrder extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(
      html`
        <div class="v-order">
          <div class="v-order__head">
            <a href="/order/new" class="v-order__create">
              <e-icon icon="add"></e-icon>
            </a>
          </div>
        </div>
      `,
      this.heading
    )
  }
}