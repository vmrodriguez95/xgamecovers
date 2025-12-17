import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { ComplexOption } from '../../domain/form/form.types'

// Styles
import style from './e-select-multiple.style.scss?inline'

@customElement('e-select-multiple')
class ESelectMultiple extends LitElement {

  private _internals: ElementInternals

  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) label = ''

  @property({ type: Array }) value: String[] = []

  @property({ type: String }) placeholder = ''

  @property({ type: String }) helpmsg = ''

  @property({ type: Array }) options: ComplexOption[] = []

  @property({ type: Boolean, reflect: true }) required = false

  @property({ type: Boolean }) readonly = false

  static styles = css`${unsafeCSS(style)}`

  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  connectedCallback(): void {
    super.connectedCallback()

    this._validate()
  }

  render() {
    return html`
      <div class="e-select-multiple">
        ${when(this.label, () => html`
          <p class="e-select-multiple__heading">
            ${this.label} ${when(this.required, () => html`*`)}
          </p>
        `)}
        <div class="e-select-multiple__wrapper">
          ${map(this.options, (option, index) => html`
            <label class=${this._getLabelClasses(option)} for="${this.id}-${index}">
              <input
                id="${this.id}-${index}"
                name=${this.name}
                class="e-select-multiple__field"
                type="checkbox"
                ?readonly=${this.readonly}
                ?required=${this.required}
                value=${option.value}
                ?checked=${this.value.includes(option.value)}
                @change=${this._onChange}
              />
              <e-logo
                logo=${option.color ? '' : option.logo}
                icon=${option.color ? option.logo : ''}
                color=${option.color}
                ?active=${this.value.includes(option.value)}
              ></e-logo>
            </label>
          `)}
        </div>
        ${when(this._internals.validationMessage, () => html`
          <p class="e-select-multiple__error">${this._internals.validationMessage}</p>
        `)}
        ${when(this.helpmsg, () => html`
          <p class="e-select-multiple__helpmsg">${this.helpmsg}</p>
        `)}
      </div>
    `
  }

  private _getLabelClasses(option: ComplexOption) {
    return classMap({
      'e-select-multiple__fake-field': true,
      [`e-select-multiple__fake-field--${option.color}`]: option.color
    })
  }

  private _valueExists(value: string) {
    return this.value.includes(value)
  }

  private _filterByValue(value: string) {
    return this.value.filter(item => item !== value)
  }

  private _onChange(e: Event) {
    const target = e.target as HTMLInputElement
    const newValue = target.value

    this.value = this._valueExists(newValue) ? this._filterByValue(newValue) : [...this.value, newValue]

    this._validate()
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