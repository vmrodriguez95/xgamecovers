import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { map } from 'lit/directives/map.js'

// Auth
import { authStore } from '../../domain/auth/auth.store'

// Controllers
import { RouterController } from '../../controllers/router.controller'

// Styles
import style from './c-menu.style.scss?inline'
import { authRepository } from '../../domain/auth/auth.repository'

@customElement('c-menu')
class CMenu extends LitElement {

  @state() user = authStore.user

  _routerContoller = new RouterController(this)

  _menu = [
    {
      url: this._routerContoller.getAdminRoute('home'),
      label: 'Home',
      icon: 'home',
      logged: false
    },
    {
      url: this._routerContoller.getAdminRoute('catalogue'),
      label: 'Catálogo',
      icon: 'gamepad',
      logged: false
    },
    {
      url: this._routerContoller.getAdminRoute('order'),
      label: 'Pedidos',
      icon: 'storefront',
      logged: true
    },
    {
      url: this._routerContoller.getAdminRoute('transaction'),
      label: 'Transacciones',
      icon: 'receipt',
      logged: true
    },
    {
      url: this._routerContoller.getAdminRoute('client'),
      label: 'Clientes',
      icon: 'client',
      logged: true
    }
  ]

  connectedCallback(): void {
    super.connectedCallback()

    authRepository.onAuthChange((user) => {
      this.user = user
    })
  }

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <nav class="c-menu">
        <ul class="c-menu__list">
          ${map(this._menu, (item: any) =>
            when(!item.logged || item.logged && authStore.isLogged(), () => html`
              <li class="c-menu__item">
                <a href=${item.url} class="c-menu__link ${this.isCurrent(item.url) ? 'c-menu__link--active' : ''}" title=${item.label}>
                  <e-icon icon=${item.icon} size="l"></e-icon>
                </a>
              </li>
            `)
          )}
          <li class="c-menu__item">
            ${when(!authStore.isLogged(), () => html`
              <e-button @click=${this._onLogin}>
                <e-icon icon="login"></e-icon>
              </e-button>
            `, () => html`
              <e-button @click=${this._onLogout}>
                <e-icon icon="logout"></e-icon>
              </e-button>
            `)}
          </li>
        </ul>
      </nav>
    `
  }

  private isCurrent(url: string) {
    return url === '/' ? location.pathname === url : location.pathname.includes(url)
  }

  private async _onLogin() {
    await authStore.login()
    location.reload()
  }

  private async  _onLogout() {
    await authStore.logout()
    location.reload()
  }
}