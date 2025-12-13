import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Styles
import style from './e-button.style.scss?inline'

@customElement('e-button')
export class EButton extends LitElement {

  @property({ type: String }) color = 'primary'

  @property({ type: String }) size = ''

  @property({ type: Boolean }) loading = false

  static styles = css`${unsafeCSS(style)}`

  render() {
    const classes = classMap({
      'e-button': true,
      [`e-button--${this.size}`]: this.size
    })

    return html`
      <button class=${classes} ?disabled=${this.loading}>
        <slot></slot>
        ${when(this.loading, () => html`<div class="e-button__shape"></div>`)}
      </button>
    `
  }
}