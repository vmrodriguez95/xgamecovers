import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'

// Styles
import style from './c-card-progress.style.scss?inline'

@customElement('c-card-progress')
class CCardProgress extends LitElement {

  @property({ type: String }) name = ''

  @property({ type: String }) icon = ''

  @property({ type: String }) color = ''
  
  @property({ type: String }) money = ''
  
  @property({ type: Number }) progress = 0

  @state() loaded = false

  static styles = css`${unsafeCSS(style)}`

  protected firstUpdated(_changedProperties: PropertyValues): void {
    if (!this.loaded) {
      setTimeout(() => { this.loaded = true }, 10)
    }
  }

  render() {
    const styles = {}

    if (this.color) {
      Object.defineProperty(styles, '--avatarColor', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: `var(--color-status--${this.color})`
      })
    }

    return html`
      <div class="c-card-progress" style=${styleMap(styles)}>
        <div class="c-card-progress__avatar">
          <e-icon icon="${this.icon}" size="l"></e-icon>
        </div>
        <div class="c-card-progress__info">
          <p class="c-card-progress__text">${this.name}</p>
          <p class="c-card-progress__text">${this.money}€</p>
        </div>
        <div class="c-card-progress__bar">
          <div class="c-card-progress__filled" style="width: ${this.loaded ? this.progress : 0}%"></div>
        </div>
      </div>
    `
  }
}