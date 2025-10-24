import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

// Styles
import style from './e-input.style.scss?inline'

@customElement('e-input')
class EInput extends LitElement {

  @property({ type: String }) id = ''

  @property({ type: String }) name = ''

  @property({ type: String }) icon = ''

  @property({ type: String }) type = ''

  @property({ type: String }) placeholder = ''

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="e-input">
        ${when(this.icon, () => html`
          <e-icon class="e-input__icon" icon=${this.icon}></e-icon>
        `)}
        <input
          id=${this.id}
          name=${this.name}
          class="e-input__field"
          type=${this.type}
          placeholder=${this.placeholder}
        />
      </div>
    `
  }
}