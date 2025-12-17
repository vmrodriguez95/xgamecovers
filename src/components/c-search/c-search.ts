import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

// Styles
import style from './c-search.style.scss?inline'

@customElement('c-search')
class CSearch extends LitElement {

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
          autocomplete="off"
          value=""
        ></e-input>
      </div>
    `
  }

  /*
   Methods
   */
}