import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

// Styles
import style from './c-header.style.scss?inline'

@customElement('c-header')
class CHeader extends LitElement {

  @property({ type: String }) heading = ''

  @state() isMenuOpened = false

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-header">
        <button class="c-header__menu" @click=${this._openMenu}>
          <e-icon icon="menu"></e-icon>
        </button>
        <p class="c-header__title"><strong>${this.heading || 'XGameCovers'}</strong></p>
        <img src="/images/logo.png" alt="Logo" width="40" height="40" />
        <c-menu
          ?opened=${this.isMenuOpened}
          @close=${this._onClose}
        ></c-menu>
      </div>
    `
  }

  private _openMenu() {
    this.isMenuOpened = !this.isMenuOpened
  }

  private _onClose() {
    this.isMenuOpened = false
  }
}