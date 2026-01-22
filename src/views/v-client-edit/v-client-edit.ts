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
import { ConfirmController } from '../../controllers/confirm.controller.ts'

// Types
import type { Client } from '../../domain/client/client.types.ts'
import type { URLParam } from '../../domain/generic/generic.types.ts'

// Styles
import style from './v-client-edit.style.scss?inline'

@customElement('v-client-edit')
class VClientEdit extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _client: Client | null = null

  @state() _formscheme = ClientFormScheme

  _routerController = new RouterController(this)

  _confirmController = new ConfirmController(this)

  @query('c-form') form!: HTMLFormElement

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    await this._loadClient()
    this._fillFormValues()
    
    super.connectedCallback()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-client-edit">
          <div class="v-client-edit__head">
            <button class="v-client-edit__delete" @click=${this._deleteHandler}>
              <e-icon icon="delete"></e-icon>
            </button>
          </div>
          <c-form
            class="v-client-edit__form"
            .scheme=${this._formscheme}
          ></c-form>
          <div class="v-client-edit__actions">
            <e-button class="v-client-edit__button" size="full" @click=${this._goBack}>Cancelar</e-button>
            <e-button class="v-client-edit__button" size="full" @click=${this.editClient}>Guardar</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private async _loadClient() {
    this._client = await clientRepository.getById(this.urlParams.id)
  }

  private _setFormValues(client: Client) {
    (Object.keys(this._formscheme) as Array<keyof Client>).forEach((key) => {
      this._formscheme[key].fillValue = client[key]
    })
  }

  private _fillFormValues() {
    if (!this._client) return
    this._setFormValues(this._client)
  }

  private editClient() {
    const data = this.form.getFinalData()

    if (data) {
      clientRepository.update(data.id, data)
      this._goBack()
    }
  }

  async _deleteHandler() {
    if (!this._client) return

    const userChoise = await this._confirmController.confirm('¿Realmente quieres eliminar el cliente?')

    if (!userChoise) return

    await clientRepository.delete(this._client.id)

    this._goBack()
  }

  private _goBack() {
    location.href = this._routerController.getAdminRoute('client', {})
  }
}