import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { ComplexOption } from '../../domain/form/form.types.ts'

// Styles
import style from './e-select-preview.style.scss?inline'

@customElement('e-select-preview')
export class ESelectPreview extends LitElement {

  private _internals: ElementInternals

  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) label = ''

  @property({ type: String, reflect: true }) value = ''

  @property({ type: String }) helpmsg = ''

  @property({ type: Array }) options: ComplexOption[] = []

  @property({ type: Boolean }) required = false

  @property({ type: Boolean }) readonly = false

  static styles = css`${unsafeCSS(style)}`

  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  render() {
    return html`
      <div class="e-select-preview">
        ${when(this.label, () => html`
          <label class="e-select-preview__label" for=${this.id}>
            ${this.label} ${when(this.required, () => html`*`)}
          </label>
        `)}
        <div class="e-select-preview__options">
          ${map(this.options, (option: ComplexOption) => html`
            <button
              class=${classMap({
                'e-select-preview__button': true,
                'e-select-preview__option': true,
                'e-select-preview__option--active': option.value === this.value
              })}
              @click=${() => this._onChange(option)}
            >
              <img class="e-select-preview__miniature" src=${option.logo} alt=${option.name} width="128" height="72" />
            </button>
          `)}
        </div>
        ${when(this._internals.validationMessage, () => html`
          <p class="e-select-preview__error">${this._internals.validationMessage}</p>
        `)}
        ${when(this.helpmsg, () => html`
          <p class="e-select-preview__helpmsg">${this.helpmsg}</p>
        `)}
      </div>
    `
  }

  private _onChange(option: ComplexOption) {
    this.value = option.value

    this._validate()
    this._internals.setFormValue(this.value)
    this.dispatchEvent(new Event('change'))
  }

  private _validate() {
    const validity = this._calculateValidity()
    
    if (validity.valid) {
      this._internals.setValidity({})
      return
    }

    this._internals.setValidity(
      validity.state,
      validity.message,
      this
    )
  }

  private _getDefaultValidy() {
    return { valid: true, message: "", state: {} as any }
  }

  private _getRequiredValidy() {
    return {
      valid: false,
      message: "Este campo es obligatorio",
      state: { valueMissing: true }
    }
  }

  private _calculateValidity() {
    // required
    if (this.required && !this.value) {
      return this._getRequiredValidy()
    }

    return this._getDefaultValidy() 
  }
}