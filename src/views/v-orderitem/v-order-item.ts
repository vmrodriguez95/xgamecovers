import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { until } from 'lit/directives/until.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Types
import { Game } from '../../domain/game/game.types.ts'
import { Design } from '../../domain/design/design.types.ts'
import { Console } from '../../domain/console/console.types.ts'
import { URLParam } from '../../domain/generic/generic.types.ts'

// Repository
import { gameRepository } from '../../domain/game/game.repository.ts'
import { designRepository } from '../../domain/design/design.repository.ts'
import { consoleRepository } from '../../domain/console/console.repository.ts'

// Styles
import style from './v-order-item.style.scss?inline'

@customElement('v-order-item')
class VOrderItem extends LayoutMixin(LitElement) {

  @property() urlParams!: URLParam

  @state() _gameList: Game[] = []

  @state() _queryGameList: Game[] = []

  @state() _consoleList: Console[] = []

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback() {
    super.connectedCallback()

    this._loadConsoleList()
    this._loadGameList()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-order-item">
        <div class="v-order-item__actions">
          <a href=${this._getPreviousUrl()}>
            <e-icon icon="arrow-left"></e-icon>
          </a>
        </div>
        <c-search
          class="v-order-item__search"
          placeholder="Buscar juego"
          @search=${this._searchHandler}
        ></c-search>
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
      <a class="v-order-item__link" href=${this._getOrderItemAddUrl(this.urlParams.idOrder, game.id)}>
        <c-card
          name=${game.name}
          image=${design?.poster}
          .consoles=${this._getConsoleLogos(game)}
        ></c-card>
      </a>
    `
  }

  private _getOrderItemAddUrl(idOrder: string = '', idGame: string) {
    return this._routerController.getAdminRoute('orderItemNew', { idOrder, idGame })
  }

  private _getPreviousUrl() {
    return this._routerController.getAdminRoute('orderView', { id: this.urlParams.idOrder })
  }

  private _searchHandler(e: CustomEvent) {
    const query = e.detail

    this._queryGameList = this._gameList.filter((game) => game.name.toLowerCase().includes(query.toLowerCase()))
  }
}