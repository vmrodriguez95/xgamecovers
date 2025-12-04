import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

// Styles
import style from './e-button.style.scss?inline'

@customElement('e-button')
export class EButton extends LitElement {

  @property({ type: String }) color = 'primary'

  @property({ type: Boolean }) loading = false

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <button class="e-button" ?disabled=${this.loading}>
        <slot></slot>
        ${when(this.loading, () => html`<div class="e-button__shape"></div>`)}
      </button>
    `
  }
}