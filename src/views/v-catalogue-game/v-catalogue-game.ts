import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import type { Game } from '../../domain/game/game.types.ts'
import type { Design } from '../../domain/design/design.types.ts'
import type { Console } from '../../domain/console/console.types.ts'
import type { URLParam } from '../../domain/generic/generic.types.ts'
import type { Slide } from '../../components/c-slider/c-slider.types.ts'

// Repository
import { gameRepository } from '../../domain/game/game.repository.ts'
import { designRepository } from '../../domain/design/design.repository.ts'
import { consoleRepository } from '../../domain/console/console.repository.ts'
import { storageRepository } from '../../domain/storage/storage.repository.ts'

// Controllers
import { ConfirmController } from '../../controllers/confirm.controller.ts'
import { RouterController } from '../../controllers/router.controller.ts'

// Auth
import { authStore } from '../../domain/auth/auth.store.ts'

// Utils
import { CATALOGUE_IMAGE_PATH } from '../../utils/consts.utils.ts'

// Styles
import style from './v-catalogue-game.style.scss?inline'

@customElement('v-catalogue-game')
class VCatalogueGame extends LayoutMixin(LitElement) {

  @property({ type: Object }) heading: string = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _game!: Game

  @state() _designs: Design[] = []

  @state() _consoles: Console[] = []

  @state() _lastDesignChoosenName: string = ''

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
          <a class="v-catalogue-game__action" href=${this._routerController.getAdminRoute('catalogue', {})}>
            <e-icon icon="arrow-left" size="m"></e-icon>
          </a>
          ${when(authStore.isLogged() && this._game, () => html`
            <a class="v-catalogue-game__action" href=${this._routerController.getAdminRoute('catalogueEdit', { id: this._game?.id })}>
              <e-icon icon="edit" size="m"></e-icon>
            </a>
            <button class="v-catalogue-game__action" @click=${this._deleteHandler}>
              <e-icon icon="delete" size="m"></e-icon>
            </button>
          `)}
        </div>
        ${when(this._designs.length > 0, () => html`
          <c-slider
            class="v-catalogue-game__slider"
            .options=${this._transformIntoSlides(this._designs)}
            @change=${this._changeDesign}
          ></c-slider>
        `)}
        <div class="v-catalogue-game__info">
          ${when(this._lastDesignChoosenName, () => html`
            <p class="v-catalogue-game__title">Nombre del diseño</p>
            <h1 class="v-catalogue-game__name">${this._lastDesignChoosenName}</h1>
          `)}
          <p class="v-catalogue-game__title">Plataformas</p>
          <div class="v-catalogue-game__logos">
            ${map(this._consoles, (console: Console) => html`
              <e-logo
                icon=${console.logo}
                color=${console.color}
                ?active=${this._game?.consoles.includes(console.id)}
              ></e-logo>
            `)}
          </div>
          ${when(this._game && this._game.socialMedia, () => html`
            <p class="v-catalogue-game__title">Publicaciones</p>
            <div class="v-catalogue-game__logos">
              ${map(this._game.socialMedia, (platform: string) => html`
                <img class="v-catalogue-game__logo" src="/images/logos/${platform}.png" width="48" height="48" alt="${platform}">
              `)}
            </div>
          `)}
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
    const game = await gameRepository.getById(this.urlParams.id)

    if (game) {
      this._game = game
      this.heading = this._game.name
    } else {
      this._kickOut()
    }
  }

  private async _loadDesigns() {
    const designs = await designRepository.getByIdGame(this.urlParams.id)

    if (designs.length > 0) {
      this._designs = designs
      this._lastDesignChoosenName = designs[0].name
    }
  }

  private _transformIntoSlides(designs: Design[]): Slide[] {
    const slides = designs.map((design: Design): Slide => ({
      id: design.id,
      name: design.name,
      image: design.slipcover
    }))

    return slides
  }

  private _changeDesign(event: CustomEvent) {
    this._lastDesignChoosenName = event.detail
  }

  private async _removeGame(idGame: string = '') {
    await gameRepository.delete(idGame)
  }

  private async _removeDesign(idDesign: string = '') {
    await designRepository.delete(idDesign)
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