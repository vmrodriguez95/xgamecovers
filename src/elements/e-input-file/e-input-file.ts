import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Styles
import style from './e-input-file.style.scss?inline'

@customElement('e-input-file')
class EInputFile extends LitElement {

  private _internals: ElementInternals

  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) label = ''

  @property({ type: String }) logo = ''

  @property({ type: String }) icon = ''

  @property({ type: String }) type = ''

  @property({ type: String }) fillValue = ''

  @property({ type: String }) placeholder = ''

  @property({ type: String }) helpmsg = ''

  @property({ type: Number }) minlength = 0

  @property({ type: Number }) maxlength = 255

  @property({ type: Boolean, reflect: true }) required = false

  @property({ type: Boolean }) readonly = false

  @state() value = ''

  static styles = css`${unsafeCSS(style)}`

  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  connectedCallback(): void {
    super.connectedCallback()

    this.value = this.fillValue
    this._validate()
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.value = this.fillValue
  }

  render() {
    const inputClasses = classMap({
      'e-input-file': true,
      'e-input-file--hidden': this.type === 'hidden'
    })

    return html`
      <div class=${inputClasses}>
        ${when(this.label, () => html`
          <label class="e-input-file__label" for=${this.id}>
            ${this.label} ${when(this.required, () => html`*`)}
            ${when(this.logo, () => html`
              <img class="e-input-file__logo" src="/images/logos/${this.logo}.png" width="16" height="16" alt="Logo ${this.name}" />
            `) }
          </label>
        `)}
        <div class="e-input-file__wrapper">
          ${when(this.icon, () => html`
            <e-icon class="e-input-file__icon" icon=${this.icon}></e-icon>
          `)}
          <input
            id=${this.id}
            name=${this.name}
            class="e-input-file__field"
            type=${this.type}
            ?readonly=${this.readonly}
            ?required=${this.required}
            placeholder=${this.placeholder}
            .minlength=${this.minlength}
            .maxlength=${this.maxlength}
            value=${this.fillValue}
            @input=${this._onInput}
            @blur=${this._onBlur}
          />
        </div>
        ${when(this._internals.validationMessage, () => html`
          <p class="e-input-file__error">${this._internals.validationMessage}</p>
        `)}
        ${when(this.helpmsg, () => html`
          <p class="e-input-file__helpmsg">${this.helpmsg}</p>
        `)}
      </div>
    `
  }

  private _onInput(e: Event) {
    const target = e.target as HTMLInputElement
    this.value = target.value

    this._validate()
    this._internals.setFormValue(this.value)
  }

  private _onBlur() {
    this._validate()
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

  private _getMinLengthValidy() {
    return {
      valid: false,
      message: `Debe tener mínimo ${this.minlength} caracteres`,
      state: { tooShort: true }
    }
  }

  private _getMaxLengthValidy() {
    return {
      valid: false,
      message: `No puede tener más de ${this.maxlength} caracteres`,
      state: { tooLong: true }
    }
  }

  private _calculateValidity() {
    // required
    if (this.required && !this.value) {
      return this._getRequiredValidy()
    }
    
    if (this.minlength && this.value.length < this.minlength) {
      return this._getMinLengthValidy()
    }
    
    if (this.maxlength && this.value.length > this.maxlength) {
      return this._getMaxLengthValidy()
    }

    return this._getDefaultValidy() 
  }
}