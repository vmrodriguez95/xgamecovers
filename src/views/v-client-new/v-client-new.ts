import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { clientRepository } from '../../domain/client/client.repository.ts'

// Form
import { ClientFormScheme } from '../../domain/client/client.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-client-new.style.scss?inline'

@customElement('v-client-new')
class VClientNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _formscheme = ClientFormScheme

  @query('c-form') form!: HTMLFormElement

  _routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(
      html`
        <div class="v-client-new">
          <c-form
            class="v-client-new__form"
            .scheme=${this._formscheme}
          ></c-form>
          <div class="v-client-new__actions">
            <e-button class="v-client-new__button" size="full" @click=${this._goBack}>Cancelar</e-button>
            <e-button class="v-client-new__button" size="full" @click=${this.createCLient}>Crear</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private async createCLient() {
    const data = this.form.getFinalData()

    if (data) {
      await clientRepository.create(data)
      this._goBack()
    }
  }

  private _goBack() {
    location.href = this._routerController.getAdminRoute('client', {})
  }
}
