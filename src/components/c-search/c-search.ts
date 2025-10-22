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
        <h1>Search</h1>
      </div>
    `
  }
}