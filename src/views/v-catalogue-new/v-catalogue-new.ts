import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

// Form
import { CatalogueFormscheme } from '../../domain/catalogue/catalogue.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Repositories
import { consoleRepository } from '../../domain/console/console.repository.ts'
import { catalogueDesignRepository, catalogueGameRepository } from '../../domain/catalogue/catalogue.repository.ts'

// Types
import { Fieldscheme } from '../../domain/form/form.types.ts'
import { Console } from '../../domain/console/console.types.ts'
import { Design, Game } from '../../domain/catalogue/catalogue.types.ts'

// Styles
import style from './v-catalogue-new.style.scss?inline'

@customElement('v-catalogue-new')
class VCatalogueNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''
  
  @property({ type: String }) entity = ''

  @state() _formscheme = CatalogueFormscheme

  @query('c-form') form!: HTMLFormElement

  routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()

    this._fillConsolesOptions()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue-new">
        <c-form
          class="v-catalogue-new__form"
          .scheme=${this._formscheme}
        ></c-form>
        <div class="v-catalogue-new__actions">
          <e-button class="v-catalogue-new__button" @click=${this._goBack}>Cancelar</e-button>
          <e-button class="v-catalogue-new__button" @click=${this._createHandler}>Crear</e-button>
        </div>
      </div>
    `)
  }

  private async _getConsolesAsOptions() {
    const allConsole = await consoleRepository.getAll()

    return allConsole.map((console: Console) => ({
      value: console.id,
      name: console.name,
      logo: console.logo,
      color: console.color
    }))
  }

  private async _fillConsolesOptions() {
    const newscheme = window.structuredClone(this._formscheme)
    const platforms = newscheme.platforms as Fieldscheme

    platforms.options = await this._getConsolesAsOptions()

    this._formscheme = newscheme
  }

  private async _insertGame(data: Game): Promise<string | null> {
    return await catalogueGameRepository.create(data)
  }

  private async _insertDesign(data: Design): Promise<string | null> {
    return await catalogueDesignRepository.create(data)
  }
  
  private async _createHandler() {
    const data = this.form.getFinalData() // De aquí sacamos la info de los juegos
    const fullData = this.form.getFullData() // De aquí sacamos la info de los diseños para almacenarlos

    console.log('Game data', data)
    console.log('Full Data', fullData)

    if (data) {
      const gameId = await this._insertGame(data)

      if (gameId) {
        fullData.designs.forEach(async (design: Design, index: number) => {
          design.idGame = gameId
          const designId = await this._insertDesign(design)

          if (designId) {
            // Por cada diseño creado, almacenamos las imágenes en el storage
            console.log(`El diseño de ${design.name} ha sido creado con el id ${designId}`)
          } else {
            throw new Error(`No se pudo crear el diseño ${index + 1}`)
          }
        })
      } else {
        throw new Error('No se pudo crear el juego')
      }
    }
  }

  private _goBack() {
    location.href = this.routerController.getAdminRoute('catalogue', {})
  }
}