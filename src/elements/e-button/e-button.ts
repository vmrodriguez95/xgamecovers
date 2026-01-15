import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'

// Styles
import style from './e-button.style.scss?inline'

@customElement('e-button')
export class EButton extends LitElement {

  @property({ type: String }) color = 'primary'

  @property({ type: String }) size = ''

  @property({ type: Boolean }) loading = false

  static styles = css`${unsafeCSS(style)}`

  render() {
    const classes = {
      'e-button': true,
      [`e-button--${this.size}`]: this.size
    }

    const styles = {}

    if (this.color) {
      Object.defineProperty(styles, '--backgroundColor', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: `var(--color-status--${this.color})`
      })
    }

    return html`
      <button class=${classMap(classes)} style=${styleMap(styles)} ?disabled=${this.loading}>
        <slot></slot>
        ${when(this.loading, () => html`<div class="loader"></div>`)}
      </button>
    `
  }
}