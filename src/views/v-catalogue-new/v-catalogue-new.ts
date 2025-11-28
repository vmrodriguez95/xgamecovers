import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

// Form
import { CatalogueFormSchema } from '../../domain/catalogue/catalogue.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

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
          <e-button class="v-catalogue-new__button" @click=${this.createGame}>Crear</e-button>
        </div>
      </div>
    `)
  }
  
  private createGame() {
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