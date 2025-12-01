import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

// Form
import { CatalogueFormSchema } from '../../domain/catalogue/catalogue.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Repositories
import { consoleRepository } from '../../domain/console/console.repository.ts'

// Types
import { ComplexOption } from '../../domain/form/form.types.ts'
import type { Console } from '../../domain/console/console.types.ts'

// Styles
import style from './v-catalogue-new.style.scss?inline'

@customElement('v-catalogue-new')
class VCatalogueNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''
  
  @property({ type: String }) entity = ''

  @state() _formSchema = CatalogueFormSchema

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
          action="/order"
          class="v-catalogue-new__form"
          .schema=${this._formSchema}
        ></c-form>
        <div class="v-catalogue-new__actions">
          <e-button class="v-catalogue-new__button" @click=${this._goBack}>Cancelar</e-button>
          <e-button class="v-catalogue-new__button" @click=${this._createGame}>Crear</e-button>
        </div>
      </div>
    `)
  }

  private async _fillConsolesOptions() {
    const allConsole = await consoleRepository.getAll()
    const newSchema = window.structuredClone(this._formSchema)

    const options: ComplexOption[] = allConsole
      .map((console: Console) => {
        return {
          value: console.id,
          name: console.name,
          logo: console.logo,
          color: console.color
        }
      })

    newSchema.platforms.options = options

    this._formSchema = newSchema
  }
  
  private _createGame() {
    const data = this.form.getFinalData()
    const rawData = this.form.getRawData()

    console.log('Final data', data)
    console.log('Raw Data', rawData)

    if (data) {
      // orderRepository.create(data)
    }
  }

  private _goBack() {
    location.href = this.routerController.getAdminRoute('catalogue', {})
  }
}