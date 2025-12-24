import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

// Types
import { EInput } from '../../elements/e-input/e-input'

// Utils
import { debounce } from '../../utils/events.utils'

// Styles
import style from './c-search.style.scss?inline'

@customElement('c-search')
class CSearch extends LitElement {

  @property({ type: String }) loading = false

  @query('e-input') _input!: EInput

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-search">
        <e-input
          icon="search"
          id="search"
          type="text"
          placeholder="Buscar juego"
          name="search"
          value=""
          @input=${this._onInput}
        ></e-input>
        ${when(this.loading, () => html`<div class="c-search__loader loader"></div>`)}
      </div>
    `
  }

  /*
   Methods
   */
  private _onInput() {
    this.dispatchEvent(new CustomEvent('search', { detail: this._input.value }))
  }
}