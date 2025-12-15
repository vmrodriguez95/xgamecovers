import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { live } from 'lit/directives/live.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { Option } from '../../domain/form/form.types.ts'

// Styles
import style from './e-select.style.scss?inline'

@customElement('e-select')
class ESelect extends LitElement {

  private _internals: ElementInternals

  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) label = ''

  @property({ type: String }) type = ''

  @property({ type: String, reflect: true }) value = ''

  @property({ type: String }) placeholder = ''

  @property({ type: String }) helpmsg = ''

  @property({ type: Array }) options: Option[] = []

  @property({ type: Boolean }) required = false

  @property({ type: Boolean }) readonly = false

  static styles = css`${unsafeCSS(style)}`

  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  render() {
    const inputClasses = classMap({
      'e-select': true,
      'e-select--hidden': this.type === 'hidden'
    })

    return html`
      <div class=${inputClasses}>
        ${when(this.label, () => html`
          <label class="e-select__label" for=${this.id}>
            ${this.label} ${when(this.required, () => html`*`)}
          </label>
        `)}
        <div class="e-select__wrapper">
          <e-icon class="e-select__icon" icon="arrow-down"></e-icon>
          <select
            id=${this.id}
            name=${this.name}
            class="e-select__field"
            type=${this.type}
            ?readonly=${this.readonly}
            ?required=${this.required}
            placeholder=${this.placeholder}
            value=${this.value}
            @change=${this._onChange}
          >
            <option value="">Selecciona una opción</option>
            ${map(this.options, (option: Option) => html`
              <option value=${option.value} ?selected=${this.value === option.value}>${option.name}</option>
            `)}
          </select>
        </div>
        ${when(this._internals.validationMessage, () => html`
          <p class="e-select__error">${this._internals.validationMessage}</p>
        `)}
        ${when(this.helpmsg, () => html`
          <p class="e-select__helpmsg">${this.helpmsg}</p>
        `)}
      </div>
    `
  }

  private _onChange(e: Event) {
    const target = e.target as HTMLInputElement

    this.value = target.value

    this._validate()
    this._internals.setFormValue(this.value)
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
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