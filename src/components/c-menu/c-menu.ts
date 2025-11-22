import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

// Styles
import style from './c-menu.style.scss?inline'

@customElement('c-menu')
class CHeader extends LitElement {

  @property({ type: Boolean }) opened = false

  static styles = css`${unsafeCSS(style)}`

  render() {
    const classes = classMap({
      'c-menu': true,
      'c-menu--active': this.opened
    })
    return html`
      <nav class=${classes}>
        <ul class="c-menu__list">
          <li class="c-menu__item">
            <a href="/" class="c-menu__link"><e-icon icon="home"></e-icon>Home</a>
          </li>
          <li class="c-menu__item">
            <a href="/catalogue" class="c-menu__link"><e-icon icon="gamepad"></e-icon>Catálogo</a>
          </li>
          <li class="c-menu__item">
            <a href="/order" class="c-menu__link"><e-icon icon="storefront"></e-icon>Pedidos</a>
          </li>
          <li class="c-menu__item">
            <a href="/transaction" class="c-menu__link"><e-icon icon="receipt"></e-icon>Transacciones</a>
          </li>
          <li class="c-menu__item">
            <a href="/login" class="c-menu__link"><e-icon icon="person"></e-icon>Iniciar sesión</a>
          </li>
        </ul>
      </nav>
      <div
        class="c-menu__overlay ${this.opened ? 'c-menu__overlay--active' : ''}"
        @click=${this._onClose}
      ></div>
    `
  }

  private _onClose() {
    this.opened = false
    this.dispatchEvent(new Event('close'))
  }
}