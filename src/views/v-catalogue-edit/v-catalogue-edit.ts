import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import { URLParam } from '../../domain/generic/generic.types.ts'

// Styles
import style from './v-catalogue-edit.style.scss?inline'

@customElement('v-catalogue-edit')
class VCatalogueEdit extends LayoutMixin(LitElement) {

  @property({ type: Object }) urlParams: URLParam = { id: "0" }

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue-edit">

      </div>
    `)
  }

  /*
   Methods
   */
}