import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Styles
import style from './e-checkbox.style.scss?inline'

@customElement('e-checkbox')
class ECheckbox extends LitElement {

  private _internals: ElementInternals

  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) label = ''

  @property({ type: String }) icon = ''
  
  @property({ type: String }) iconChecked = ''

  @property({ type: String }) type = ''

  @property({ type: Boolean }) checked = false

  @property({ type: String }) helpmsg = ''

  @property({ type: Boolean, reflect: true }) required = false

  @property({ type: Boolean }) readonly = false

  static styles = css`${unsafeCSS(style)}`

  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  render() {
    const classes = classMap({
      'e-checkbox': true,
      'e-checkbox--checked': this.checked
    })
    return html`
      <div class=${classes}>
        <label class="e-checkbox__label" for=${this.id}>
          ${when(this.label, () => html`
            ${this.label} ${when(this.required, () => html`*`)}
          `)}
          <e-icon class="e-checkbox__icon" icon=${this.checked ? this.iconChecked : this.icon}></e-icon>
          <input
            id=${this.id}
            name=${this.name}
            class="e-checkbox__field"
            type="checkbox"
            ?checked=${this.checked}
            ?readonly=${this.readonly}
            ?required=${this.required}
            @change=${this._onChange}
          />
        </label>
        ${when(this.helpmsg, () => html`
          <p class="e-checkbox__helpmsg">${this.helpmsg}</p>
        `)}
      </div>
    `
  }

  private _onChange(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked
  }
}