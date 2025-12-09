import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import { Console } from '../../domain/console/console.types.ts'
import { URLParam } from '../../domain/generic/generic.types.ts'
import { Design, Game } from '../../domain/catalogue/catalogue.types.ts'

// Repository
import { consoleRepository } from '../../domain/console/console.repository.ts'
import { storageRepository } from '../../domain/storage/storage.repository.ts'
import { catalogueDesignRepository, catalogueGameRepository } from '../../domain/catalogue/catalogue.repository.ts'

// Controllers
import { ConfirmController } from '../../controllers/confirm.controller.ts'
import { RouterController } from '../../controllers/router.controller.ts'

// Auth
import { authStore } from '../../domain/auth/auth.store.ts'

// Styles
import style from './v-catalogue-game.style.scss?inline'
import { CATALOGUE_IMAGE_PATH } from '../../utils/consts.utils.ts'

@customElement('v-catalogue-game')
class VCatalogueGame extends LayoutMixin(LitElement) {

  @property({ type: Object }) heading: string = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _game!: Game

  @state() _designs: Design[] = []

  @state() _consoles: Console[] = []

  @state() _lastDesignChoosen: Design | null = null

  _routerController = new RouterController(this)

  _confirmController = new ConfirmController(this)

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    super.connectedCallback()

    await this._loadGame()
    this._loadDesigns()
    this._loadConsoles()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue-game">
        <div class="v-catalogue-game__actions">
          <a class="v-catalogue-game__button" href=${this._routerController.getAdminRoute('catalogue', {})}>
            <e-icon icon="arrow-left"></e-icon>
          </a>
          ${when(authStore.user && this._game, () => html`
            <a class="v-catalogue-game__button" href=${this._routerController.getAdminRoute('catalogueEdit', { id: this._game?.id })}>
              <e-icon icon="edit"></e-icon>
            </a>
          `)}
          ${when(authStore.user && this._game, () => html`
            <button class="v-catalogue-game__button" @click=${this._deleteHandler}>
              <e-icon icon="delete"></e-icon>
            </button>
          `)}
        </div>
        ${when(this._lastDesignChoosen, () => html`
          <div class="v-catalogue-game__head">
            <img class="v-catalogue-game__image" src=${this._lastDesignChoosen?.slipcover} alt=${this._lastDesignChoosen?.name} width="398" height="480" />
          </div>
          <div class="v-catalogue-game__designs">
            ${map(this._designs, (design: Design) => html`
              <button
                class=${classMap({
                  'v-catalogue-game__button': true,
                  'v-catalogue-game__design': true,
                  'v-catalogue-game__design--active': design.id === this._lastDesignChoosen?.id
                })}
                @click=${() => this.changeDesign(design)}
              >
                <img class="v-catalogue-game__preview" src=${design.slipcover} alt=${design.name} width="128" height="72" />
              </button>
            `)}
          </div>
        `, () => html`
          <div class="v-catalogue-game__empty">
            <p class="v-catalogue-game__empty__message">Aún no se han asociado diseños a este juego</p>
          </div>
        `)}
        <div class="v-catalogue-game__info">
          ${when(this._lastDesignChoosen, () => html`
            <p class="v-catalogue-game__title">Nombre del diseño</p>
            <h1 class="v-catalogue-game__name">${this._lastDesignChoosen?.name}</h1>
          `)}
          <p class="v-catalogue-game__title">Plataformas</p>
          <div class="v-catalogue-game__consoles">
            ${map(this._consoles, (console: Console) => html`
              <e-logo
                icon=${console.logo}
                color=${console.color}
                ?active=${this._game?.consoles.includes(console.id)}
              ></e-logo>
            `)}
          </div>
        </div>
      </div>
    `, this.heading)
  }

  /*
   Methods
   */
  private async  _loadConsoles() {
    const consoles = await consoleRepository.getAll()

    if (consoles) {
      this._consoles = consoles
    }
  }

  private async _loadGame() {
    const game = await catalogueGameRepository.getById(this.urlParams.id)

    if (game) {
      this._game = game
      this.heading = this._game.name
    } else {
      this._kickOut()
    }
  }

  private async _loadDesigns() {
    const designs = await catalogueDesignRepository.getDesignsByGame(this.urlParams.id)

    if (designs.length > 0) {
      this._designs = designs
      this._lastDesignChoosen = designs[0]
    }
  }

  private changeDesign(design: Design) {
    this._lastDesignChoosen = design
  }

  private async _removeGame(idGame: string = '') {
    await catalogueGameRepository.delete(idGame)
  }

  private async _removeDesign(idDesign: string = '') {
    await catalogueDesignRepository.delete(idDesign)
  }

  private async _removeDesignFolder(idGame: string = '', idDesign: string = '') {
    const folder = `${CATALOGUE_IMAGE_PATH}/${idGame}/${idDesign}`

    await storageRepository.deleteFolder(folder)
  }

  private async removeAllDesigns(idGame: string = '') {
    for (let i = 0; i < this._designs.length; i++) {
      const design = this._designs[i]

      await this._removeDesign(design.id)
      await this._removeDesignFolder(idGame, design.id)
    }
  }

  private async _deleteHandler() {
    const idGame = this._game.id
    const userChoise = await this._confirmController.confirm('¿Realmente quieres eliminar el juego?')

    if (!userChoise) return

    await this._removeGame(idGame)

    if (this._designs.length > 0) {
      await this.removeAllDesigns(idGame)
    }

    this._kickOut()
  }

  private _kickOut() {
    location.href = this._routerController.getAdminRoute('catalogue', {})
  }
}