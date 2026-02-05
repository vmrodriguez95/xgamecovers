import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

// Styles
import style from './c-header.style.scss?inline'

@customElement('c-header')
class CHeader extends LitElement {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-header">
        <img src="/images/logo.png" alt="Logo" width="40" height="40" />
        <p class="c-header__title"><strong>XGameCovers</strong></p>
      </div>
    `
  }
}