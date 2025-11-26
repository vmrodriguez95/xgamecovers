import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Styles
import style from './v-transaction.style.scss?inline'

@customElement('v-transaction')
class VTransaction extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(
      html`
        <div class="v-transaction">
          <div class="v-transaction__resume">
            
          </div>
          <div class="v-transaction__head">
            <a href="/transaction/new" class="v-transaction__create">
              <e-icon icon="add"></e-icon>
            </a>
          </div>
          <div class="v-transaction__list">

          </div>
        </div>
      `,
      this.heading
    )
  }
}