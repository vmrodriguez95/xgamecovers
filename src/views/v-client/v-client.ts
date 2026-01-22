import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import type { Client } from '../../domain/client/client.types.ts'

// BBDD
import { clientRepository } from '../../domain/client/client.repository.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-client.style.scss?inline'

@customElement('v-client')
class VClient extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _clientList: Client[] = []

  @state() _queryClientList: Client[] = []

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()

    this._loadClients()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-client">
          <div class="v-client__head">
            <c-search class="v-client__search" @search=${this._searchHandler} placeholder="Buscar cliente"></c-search>
            <a href=${this._getCreationRoute()}>
              <e-button><e-icon icon="add"></e-icon></e-button>
            </a>
          </div>
          <div class="v-client__list">
            ${map(this._queryClientList, (client: Client) => html`
              <a href=${this._getEditRoute(client)} class="v-client__card">
                <c-card-simple
                  type=${client.name}
                  icon="person"
                  color="blue"
                ></c-card-simple>
              </a>
            `)}
          </div>
        </div>
      `,
      this.heading
    )
  }

  async _loadClients() {
    const clientList = await clientRepository.getAll()

    this._clientList = clientList
    this._queryClientList = clientList
  }

  private _searchHandler(e: CustomEvent) {
    const query = e.detail

    this._queryClientList = this._clientList.filter((client) => client.name.toLowerCase().includes(query.toLowerCase()))
  }

  private _getCreationRoute() {
    return this._routerController.getAdminRoute('clientNew', {})
  }

  private _getEditRoute(client: Client) {
    return this._routerController.getAdminRoute('clientEdit', { id: client.id })
  }
}