import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { live } from 'lit/directives/live.js'

// Types
import type { EInput } from '../e-input/e-input'
import type { Option } from '../../domain/form/form.types'

// Utils
import { debounce } from '../../utils/events.utils'

// Styles
import style from './e-input-search.style.scss?inline'

@customElement('e-input-search')
export class EInputSearch extends LitElement {
  
  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) label = ''
  
  @property({ type: String }) placeholder = ''

  @property({ type: String }) value = ''

  @property({ type: String }) helpmsg = ''

  @property({ type: Array }) options = [] as Option[]

  @property({ type: String }) loading = false

  @property({ type: Boolean }) required = false

  @property({ type: Boolean }) readonly = false

  @state() _queryResults: Option[] = []

  @query('e-input') _input!: EInput

  @query('input[type="hidden"]') _hidden!: HTMLInputElement

  _inputValue = ''

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()

    this._inputValue = this._getNameValueFromOptions()
  }

  render() {
    return html`
      <div class="e-input-search">
        <e-input
          id=${this.id}
          type="text"
          placeholder=${this.placeholder}
          label=${this.label}
          name=${this.name}
          value=${this._inputValue}
          helpmsg=${this.helpmsg}
          ?required=${this.required}
          ?readonly=${this.readonly}
          @input=${this._onInput}
        ></e-input>
        <input type="hidden" .value=${live(this.value)} />
        ${when(this._queryResults.length > 0, () => html`
          <div class="e-input-search__results">
            ${this._queryResults.map((option) => html`
              <button class="e-input-search__result" @click=${() => this._onChange(option)}>
                ${option.name}
              </button>
            `)}
          </div>
        `)}
      </div>
    `
  }

  /*
   Methods
   */
  private _getNameValueFromOptions() {
    return this.options.find((option: any) => option.value === this.value)?.name || ''
  }

  private _onInput(ev: Event) {
    const target = ev.target as HTMLInputElement
    
    if (target.value) {
      this._queryResults = this._filterOptions(target.value)
    } else {
      this._queryResults = []
      this.value = ''
      this.dispatchEvent(new Event('change'))
    }
  }

  private _filterOptions(value: string) {
    return this.options.filter((option) => option.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
  }

  private _onChange(option: Option) {
    this._inputValue = option.name
    this.value = option.value
    this._queryResults = []
    this.dispatchEvent(new Event('change'))
  }
}