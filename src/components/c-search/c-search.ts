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
        <e-icon class="c-search__icon" icon="search"></e-icon>
        <input id="search" name="search" class="c-search__field" type="text" placeholder="Buscar juego" />
      </div>
    `
  }
}