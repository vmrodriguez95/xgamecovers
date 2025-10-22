import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

// Styles
import style from './c-header.style.scss?inline'

@customElement('c-header')
class CHeader extends LitElement {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-header">
        <button class="c-header__menu">
          <e-icon icon="menu"></e-icon>
        </button>
        <p class="c-header__title">XGameCovers</p>
        <img src="/images/logo.png" alt="Logo" width="40" height="40" />
      </div>
    `
  }
}