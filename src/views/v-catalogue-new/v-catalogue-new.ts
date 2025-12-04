import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

// Form
import { CatalogueFormscheme } from '../../domain/catalogue/catalogue.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Repositories
import { storageRepository } from '../../domain/storage/storage.repository.ts'
import { consoleRepository } from '../../domain/console/console.repository.ts'
import { catalogueDesignRepository, catalogueGameRepository } from '../../domain/catalogue/catalogue.repository.ts'

// Types
import { Fieldscheme } from '../../domain/form/form.types.ts'
import { Console } from '../../domain/console/console.types.ts'
import { Design, Game } from '../../domain/catalogue/catalogue.types.ts'

// Styles
import style from './v-catalogue-new.style.scss?inline'
import { EButton } from '../../elements/e-button/e-button.ts'

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
    const consoles = newscheme.consoles as Fieldscheme

    consoles.options = await this._getConsolesAsOptions()

    this._formscheme = newscheme
  }

  private async _insertGame(data: Game): Promise<string | null> {
    return await catalogueGameRepository.create(data)
  }

  private async _insertDesign(data: Design): Promise<string | null> {
    return await catalogueDesignRepository.create(data)
  }

  private async _uploadImage(file: File, path: string): Promise<string | null> {
    return await storageRepository.uploadImage(file, path)
  }

  private async _handleUploadImage(field: Fieldscheme, idGame: string, idDesign: string, designName: string) {
    const imagesPath = `catalogue/${idGame}/${idDesign}`

    if (field.files && field.files.length > 0) {
      const file = field.files[0]
      const filename = `${designName} - ${field.name}.${file.type.replace('image/', '')}`

      return await this._uploadImage(field.files[0], `${imagesPath}/${filename}`)
    }

    return ''
  }
  
  private async _createHandler(ev: Event) {
    const button = ev.currentTarget as EButton

    button.loading = true

    const data = this.form.getFinalData() // De aquí sacamos la info de los juegos
    const rawData = this.form.getRawData() // De aquí sacamos la info de los diseños para almacenarlos
    const fullData = this.form.getFullData() // De aquí sacamos las imágenes de los diseños para guardar las imágenes

    if (data) {
      const idGame = await this._insertGame(data)

      if (idGame) {
        fullData.designs.forEach(async (design: Design, index: number) => {
          design.idGame = idGame
          const idDesign = await this._insertDesign(design)

          if (idDesign) {
            const rawDesign = rawData.designs.fields[index]
            const { poster, slipcover, material } = rawDesign

            const posterUrl = await this._handleUploadImage(poster, idGame, idDesign, design.name)
            if (posterUrl) design.poster = posterUrl
            
            const slipcoverUrl = await this._handleUploadImage(slipcover, idGame, idDesign, design.name)
            if (slipcoverUrl) design.slipcover = slipcoverUrl
            
            const materialUrl = await this._handleUploadImage(material, idGame, idDesign, design.name)
            if (materialUrl) design.material = materialUrl

            if (posterUrl || slipcoverUrl || materialUrl) {
              await catalogueDesignRepository.update(idDesign, design)

              this._goBack()
            }
          } else {
            throw new Error(`No se pudo crear el diseño ${index + 1}`)
          }
        })
      } else {
        throw new Error('No se pudo crear el juego')
      }
    }

    button.loading = false
  }

  private _goBack() {
    location.href = this.routerController.getAdminRoute('catalogue', {})
  }
}