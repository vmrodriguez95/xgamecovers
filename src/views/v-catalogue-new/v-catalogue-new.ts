import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

// Form
import { GameFormScheme } from '../../domain/game/game.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Repositories
import { gameRepository } from '../../domain/game/game.repository.ts'
import { designRepository } from '../../domain/design/design.repository.ts'
import { storageRepository } from '../../domain/storage/storage.repository.ts'
import { consoleRepository } from '../../domain/console/console.repository.ts'

// Types
import { Game } from '../../domain/game/game.types.ts'
import { Design } from '../../domain/design/design.types.ts'
import { EButton } from '../../elements/e-button/e-button.ts'
import { FieldScheme } from '../../domain/form/form.types.ts'
import { Console } from '../../domain/console/console.types.ts'

// Styles
import style from './v-catalogue-new.style.scss?inline'

@customElement('v-catalogue-new')
class VCatalogueNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''
  
  @property({ type: String }) entity = ''

  @state() _formscheme = GameFormScheme

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
          <e-button class="v-catalogue-new__button" size="full" @click=${this._goBack}>Cancelar</e-button>
          <e-button class="v-catalogue-new__button" size="full" @click=${this._createHandler}>Crear</e-button>
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
    const consoles = newscheme.consoles as FieldScheme

    consoles.options = await this._getConsolesAsOptions()

    this._formscheme = newscheme
  }

  private async _insertGame(data: Game): Promise<string | null> {
    return await gameRepository.create(data)
  }

  private async _insertDesign(data: Design): Promise<string | null> {
    return await designRepository.create(data)
  }

  private async _uploadImage(file: File, path: string): Promise<string | null> {
    return await storageRepository.uploadImage(file, path)
  }

  private async _handleUploadImage(field: FieldScheme, idGame: string, idDesign: string, designName: string) {
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

    if (!data) {
      button.loading = false
      throw new Error('No se pudo crear el juego')
    }

    const idGame = await this._insertGame(data)
    if (!idGame) throw new Error('No se pudo crear el juego')

    for (let index = 0; index < fullData.designs.length; index++) {
      const design = fullData.designs[index]
      design.idGame = idGame

      const idDesign = await this._insertDesign(design)
      if (!idDesign) throw new Error(`No se pudo crear el diseño ${design.name}`)

      design.id = idDesign
      const rawDesign = rawData.designs.fields[index]
      const { poster, slipcover, material } = rawDesign

      const [posterUrl, slipcoverUrl, materialUrl] = await Promise.all([
        this._handleUploadImage(poster, idGame, idDesign, design.name),
        this._handleUploadImage(slipcover, idGame, idDesign, design.name),
        this._handleUploadImage(material, idGame, idDesign, design.name),
      ])

      if (posterUrl) design.poster = posterUrl
      if (slipcoverUrl) design.slipcover = slipcoverUrl
      if (materialUrl) design.material = materialUrl
      
      if (posterUrl || slipcoverUrl || materialUrl) {
        await designRepository.update(idDesign, design)
      }
    }

    this._goBack()
  }

  private _goBack() {
    location.href = this.routerController.getAdminRoute('catalogue', {})
  }
}