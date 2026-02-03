import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { until } from 'lit/directives/until.js'

// Domain
import { authStore } from '../../domain/auth/auth.store.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Types
import { Game } from '../../domain/game/game.types.ts'
import { Design } from '../../domain/design/design.types.ts'
import { Console } from '../../domain/console/console.types.ts'

// Repository
import { gameRepository } from '../../domain/game/game.repository.ts'
import { designRepository } from '../../domain/design/design.repository.ts'
import { consoleRepository } from '../../domain/console/console.repository.ts'

// Styles
import style from './v-catalogue.style.scss?inline'

@customElement('v-catalogue')
class VCatalogue extends LayoutMixin(LitElement) {

  @state() _queryGameList: Game[] = []
  
  @state() _gameList: Game[] = []

  @state() _consoleList: Console[] = []

  _userRole = '' // TODO

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback() {
    super.connectedCallback()

    this._loadGameList()
    this._loadConsoleList()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue">
        <div class="v-catalogue__head">
          <c-search class="v-catalogue__search" @search=${this._searchHandler} placeholder="Buscar juego"></c-search>
          ${when(authStore.isLogged(), () => html`
            <a href=${this._getCreateUrl()}>
              <e-button><e-icon icon="add"></e-icon></e-button>
            </a>
          `)}
        </div>
        ${when(this._consoleList.length > 0 && this._queryGameList.length > 0, () => 
          map(this._queryGameList, (game: Game) => until(this._printGameCard(game)))
        )}
      </div>
    `)
  }

  private async _loadGameList() {
    const gameList = await gameRepository.getAll()

    this._gameList = gameList
    this._queryGameList = gameList
  }

  private async _loadConsoleList() {
    this._consoleList = await consoleRepository.getAll()
  }

  private _getFavDesign(designs: Design[]) {
    return designs.find((design) => design.isFavorite)
  }

  private _findConsoleById(id: string) {
    return this._consoleList.find((console) => console.id === id)
  }

  private _getConsoleLogos(game: Game) {
    return game.consoles.map((id) => this._findConsoleById(id)?.logo)
  }

  private async _printGameCard(game: Game) {
    const designs = await designRepository.getByIdGame(game.id)
    const favDesign = this._getFavDesign(designs)
    const design = favDesign || designs[0]

    return html`
      <a class="v-catalogue__link" href=${this._routerController.getAdminRoute('catalogueGame', { id: game.id })}>
        <c-card
          name=${game.name}
          image=${design?.poster}
          .consoles=${this._getConsoleLogos(game)}
          .platforms=${authStore.isLogged() ? game.socialMedia : []}
        ></c-card>
      </a>
    `
  }

  private _getCreateUrl() {
    return this._routerController.getAdminRoute('catalogueNew', {})
  }

  private _searchHandler(e: CustomEvent) {
    const query = e.detail

    this._queryGameList = this._gameList.filter((game) => game.name.toLowerCase().includes(query.toLowerCase()))
  }
}