import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Styles
import style from './e-logo.style.scss?inline'

@customElement('e-logo')
export class ELogo extends LitElement {

  @property({ type: String }) icon = ''

  @property({ type: String }) logo = ''

  @property({ type: String }) size = ''

  @property({ type: String }) color = ''

  @property({ type: Boolean }) active = false

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div
        class=${classMap({
          'e-logo': true,
          'e-logo--active': this.active,
          [`e-logo--${this.size}`]: this.size,
          [`e-logo--${this.color}`]: this.color
        })}
      >
        ${when(this.icon, () => html`
          <e-icon icon=${this.icon} size=${this.size || 'l'}></e-icon>
        `)}

        ${when(this.logo && !this.icon, () => html`
          <img src="/images/logos/${this.logo}.png" width="48" height="48">
        `)}
      </div>
    `
  }
}