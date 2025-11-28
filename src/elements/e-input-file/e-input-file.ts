import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

// Styles
import style from './e-input-file.style.scss?inline'

@customElement('e-input-file')
class EInputFile extends LitElement {

  private _internals: ElementInternals

  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) label = ''

  @property({ type: String }) value = ''

  @property({ type: String }) accept = ''

  @property({ type: String }) helpmsg = ''

  @property({ type: Number }) maxSize = 0

  @property({ type: Boolean }) required = false

  @property({ type: Boolean }) readonly = false

  @query('.e-input-file__field') field!: HTMLInputElement

  fileLoadedSize = 0

  file: File | undefined = undefined

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
      <div class="e-input-file">
        ${when(this.label, () => html`
          <label class="e-input-file__label" for=${this.id}>
            ${this.label} ${when(this.required, () => html`*`)}
          </label>
        `)}
        <div class="e-input-file__wrapper">
          ${when(this.value === '', () => html`
            <button class="e-input-file__replacement" @click=${this._onClick}>
              <e-icon icon="add-photo"></e-icon>
            </button>
            <input
              id=${this.id}
              name=${this.name}
              class="e-input-file__field"
              type="file"
              accept=${this.accept}
              ?readonly=${this.readonly}
              ?required=${this.required}
              value=${this.value}
              @change=${this._onChange}
            />
          `, () => html`
            <img src=${this.file ? this._generateValidUrl() : this.value} class="e-input-file__image" />
          `)}
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

  private _onClick() {
    this.field.click()
  }

  private _onChange(e: Event) {
    const target = e.target as HTMLInputElement
    this.file = target.files?.[0]
    this.fileLoadedSize = this.file?.size || 0
    this.value = target.value

    this._validate()
    this._internals.setFormValue(this.value)
  }

  private _generateValidUrl() {
    return URL.createObjectURL(this.file as Blob);
  }

  private _calcFileSizeInMB(size: number): number {
    return size / (1024 * 1024)
  }

  private _validate() {
    const validity = this._calculateValidity()
    
    if (validity.valid) {
      this._internals.setValidity({})
      return
    } else {
      this._internals.setValidity(validity.state, validity.message, this)
      this.file = undefined
      this.value = ''
    }
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

  private _getMaxSizeValidy() {
    const maxSizeInMB = this._calcFileSizeInMB(this.maxSize)
    const fileSizeInMB = this._calcFileSizeInMB(this.fileLoadedSize)

    return {
      valid: false,
      message: `El archivo no puede pesar más de ${maxSizeInMB}MB. Tamaño actual: ${fileSizeInMB}MB`,
      state: { customError: true }
    }
  }

  private _calculateValidity() {
    if (this.required && !this.value) {
      return this._getRequiredValidy()
    }

    if (this.maxSize && this.fileLoadedSize > this.maxSize) {
      return this._getMaxSizeValidy()
    }

    return this._getDefaultValidy() 
  }
}