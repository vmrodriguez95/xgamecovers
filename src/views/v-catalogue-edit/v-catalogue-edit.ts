import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

// Form
import { CatalogueFormScheme } from '../../domain/catalogue/catalogue.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Repositories
import { storageRepository } from '../../domain/storage/storage.repository.ts'
import { consoleRepository } from '../../domain/console/console.repository.ts'
import { catalogueDesignRepository, catalogueGameRepository } from '../../domain/catalogue/catalogue.repository.ts'

// Types
import { EButton } from '../../elements/e-button/e-button.ts'
import { Console } from '../../domain/console/console.types.ts'
import { URLParam } from '../../domain/generic/generic.types.ts'
import { Design, Game } from '../../domain/catalogue/catalogue.types.ts'
import { FieldBlock, FieldScheme, FormScheme } from '../../domain/form/form.types.ts'

// Consts
import { CATALOGUE_IMAGE_PATH } from '../../utils/consts.utils.ts'

// Styles
import style from './v-catalogue-edit.style.scss?inline'

@customElement('v-catalogue-edit')
class VCatalogueNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @property({ type: String }) entity = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _formBlocked = false

  @state() _formscheme = CatalogueFormScheme

  @state() _game!: Game

  @state() _designs!: Design[]

  @query('c-form') form!: HTMLFormElement

  routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    super.connectedCallback()

    await this._fillConsolesOptions()
    await this._loadDesigns()
    await this._loadGame()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue-edit">
        ${when(this._game, () => html`
          <c-form
            class="v-catalogue-edit__form"
            .scheme=${this._formscheme}
          ></c-form>
        `)}
        <div class="v-catalogue-edit__actions">
          <e-button class="v-catalogue-edit__button" ?loading=${this._formBlocked} @click=${this._goBack}>Cancelar</e-button>
          <e-button class="v-catalogue-edit__button" ?loading=${this._formBlocked} @click=${this._editHandler}>Editar</e-button>
        </div>
      </div>
    `, this.heading)
  }

  private _setGameValues(game: Game) {
    this._formscheme.id.fillValue = game.id
    this._formscheme.name.fillValue = game.name
    this._formscheme.consoles.fillValue = game.consoles
  }

  private async _loadGame() {
    const game = await catalogueGameRepository.getById(this.urlParams.id)

    if (game) {
      this._game = game
      this.heading = game.name

      this._setGameValues(game)
    } else {
      this._kickOut()
    }
  }

  private _setDesignValuesInNewScheme(newScheme: FormScheme, design: Design) {
    newScheme.id.fillValue = design.id
    newScheme.idGame.fillValue = design.idGame
    newScheme.name.fillValue = design.name
    newScheme.poster.fillValue = design.poster
    newScheme.slipcover.fillValue = design.slipcover
    newScheme.material.fillValue = design.material
    newScheme.isFavorite.fillValue = design.isFavorite
  }

  private _setDesignsValue(designs: Design[]) {
    const designsFields = [] as FormScheme[]

    designs.forEach((design: Design) => {
      const formDesigns = this._formscheme.designs as FieldBlock
      const newscheme = window.structuredClone(formDesigns.structure)
      
      this._setDesignValuesInNewScheme(newscheme, design)

      designsFields.push(newscheme)
    })
    
    if ('fields' in this._formscheme.designs) {
      this._formscheme.designs.fields = designsFields
    }
  }

   private async _loadDesigns() {
    const designs = await catalogueDesignRepository.getDesignsByGame(this.urlParams.id)

    if (designs.length > 0) {
      this._designs = designs
      this._setDesignsValue(designs)
    }
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

  private async _uploadImage(file: File, path: string): Promise<string | null> {
    return await storageRepository.uploadImage(file, path)
  }

  private async _uploadAllImages(rawDesign: FormScheme, idDesign: string, design: Design) {
    const { poster, slipcover, material } = rawDesign
    let posterUrl, slipcoverUrl, materialUrl

    if ('files' in poster && poster.files) {
      posterUrl = await this._handleUploadImage(poster as FieldScheme, this._game.id, idDesign, design.name)
    }

    if ('files' in slipcover && slipcover.files) {
      slipcoverUrl = await this._handleUploadImage(slipcover as FieldScheme, this._game.id, idDesign, design.name)
    }

    if ('files' in material && material.files) {
      materialUrl = await this._handleUploadImage(material as FieldScheme, this._game.id, idDesign, design.name)
    }

    return { posterUrl, slipcoverUrl, materialUrl }
  }

  private async _deleteImagesFolder(path: string): Promise<void> {
    return await storageRepository.deleteFolder(path)
  }

  private _saveGame(idGame: string, data: Game) {
    data.id = idGame

    catalogueGameRepository.update(idGame, data)
  }

  private async _insertDesign(data: Design): Promise<string | null> {
    return await catalogueDesignRepository.create(data)
  }

  private async _insertAllDesigns(designs: Design[], rawDesigns: FormScheme[]): Promise<void> {
    designs.forEach(async (design: Design) => {
      const idDesign = await this._insertDesign(design)

      if (idDesign) {
        const rawDesign = this._getRawDesignByName(rawDesigns, design.name)

        design.id = idDesign

        if (rawDesign) {
          const { posterUrl, slipcoverUrl, materialUrl } = await this._uploadAllImages(rawDesign, idDesign, design)

          if (posterUrl) design.poster = posterUrl
          if (materialUrl) design.material = materialUrl
          if (slipcoverUrl) design.slipcover = slipcoverUrl

          if (posterUrl || slipcoverUrl || materialUrl) {
            await catalogueDesignRepository.update(idDesign, design)
          }
        }
      }
    })
  }

  private async _updateDesign(idDesign: string, data: Design): Promise<void> {
    return await catalogueDesignRepository.update(idDesign, data)
  }

  private _updateAllDesigns(designs: Design[], rawDesigns: FormScheme[]) {
    designs.forEach(async (design: Design) => {
      const rawDesign = this._getRawDesignByName(rawDesigns, design.name)

      if (rawDesign) {
        const { posterUrl, slipcoverUrl, materialUrl } = await this._uploadAllImages(rawDesign, design.id, design)
  
        if (posterUrl) design.poster = posterUrl
        if (materialUrl) design.material = materialUrl
        if (slipcoverUrl) design.slipcover = slipcoverUrl
      }


      await this._updateDesign(design.id, design)
    })
  }

  private async _deleteDesign(idDesign: string): Promise<void> {
    return await catalogueDesignRepository.delete(idDesign)
  }

  private _deleteAllDesigns(deletedDesigns: Design[]) {
    const principalImagePath = `${CATALOGUE_IMAGE_PATH}/${this._game.id}`

    deletedDesigns.forEach(async (design: Design) => {
      const imagePath = `${principalImagePath}/${design.id}`
      await this._deleteDesign(design.id)
      await this._deleteImagesFolder(imagePath)
    })
  }

  private _getRawDesignByName(rawDesigns: FormScheme[], name: string) {
    return rawDesigns.find((design: FormScheme) => design.name.fillValue === name)
  }

  private _getNewDesigns(designs: Design[]) {
    return designs.filter((design: Design) => design.id === '')
  }

  private _getModifiedDesigns(designs: Design[]) {
    return designs.filter((design: Design) => {
      return this._designs.find((oldDesign: Design) => oldDesign.id === design.id)
    })
  }

  private _getDeletedDesigns(designs: FormScheme[]) {
    return this._designs.filter((oldDesign: Design) => {
      return !designs.find((design: FormScheme) => oldDesign.id === design.id.fillValue)
    })
  }

  private async _handleUploadImage(field: FieldScheme, idGame: string, idDesign: string, designName: string) {
    const imagesPath = `${CATALOGUE_IMAGE_PATH}/${idGame}/${idDesign}`

    if (field.files && field.files.length > 0) {
      const file = field.files[0]
      const filename = `${designName} - ${field.name}.${file.type.replace('image/', '')}`

      return await this._uploadImage(file, `${imagesPath}/${filename}`)
    }

    return ''
  }
  
  private async _editHandler(ev: Event) {
    const button = ev.currentTarget as EButton

    button.loading = true

    const data = this.form.getFinalData()
    const rawData = this.form.getRawData()
    const fullData = this.form.getFullData()

    if (data) {
      await this._saveGame(this._game.id, data)

      const newDesigns = this._getNewDesigns(fullData.designs)
      const modifiedDesigns = this._getModifiedDesigns(fullData.designs)
      const deletedDesigns = this._getDeletedDesigns(rawData.designs.fields)

      if (newDesigns.length > 0) {
        await this._insertAllDesigns(newDesigns, rawData.designs.fields)
      }

      if (modifiedDesigns.length > 0) {
        await this._updateAllDesigns(modifiedDesigns, rawData.designs.fields)
      }

      if (deletedDesigns.length > 0) {
        await this._deleteAllDesigns(deletedDesigns)
      }
    }

    button.loading = false
    this._goBack()
  }

  private _goBack() {
    location.href = this.routerController.getAdminRoute('catalogueGame', { id: this.urlParams.id })
  }

  private _kickOut() {
    location.href = this.routerController.getAdminRoute('catalogue', {})
  }
}