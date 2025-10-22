import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

// Styles
import style from './c-filters.style.scss?inline'

@customElement('c-filters')
class CFilters extends LitElement {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-filters">
        <h1>Aquí van a ir los filtros tío</h1>
      </div>
    `
  }
}