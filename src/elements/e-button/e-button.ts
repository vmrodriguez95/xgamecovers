import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Styles
import style from './e-button.style.scss?inline'

@customElement('e-button')
class EButton extends LitElement {

  @property({ type: String }) color = 'primary'

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <button
        class="e-button"
      >
        <slot></slot>
      </button>
    `
  }
}