import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { styleMap } from 'lit/directives/style-map.js'

// Utils
import { showDateWithFormat} from '../../utils/date.utils.ts'

// Styles
import style from './c-card-simple.style.scss?inline'

@customElement('c-card-simple')
class CCardSimple extends LitElement {

  @property({ type: String }) type = ''

  @property({ type: String }) name = ''

  @property({ type: String }) platform = ''

  @property({ type: String }) date = ''
  
  @property({ type: String }) money = ''

  @property({ type: String }) icon = ''

  @property({ type: String }) color = ''

  static styles = css`${unsafeCSS(style)}`

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
      <div class="c-card-simple" style=${styleMap(styles)}>
        <div class="c-card-simple__avatar">
          <e-icon icon="${this.icon}" size="xl"></e-icon>
        </div>
        <div class="c-card-simple__info">
          <p class="c-card-simple__title">${this.type}</p>
          ${when(this.name, () => html`
            <p class="c-card-simple__text">${this.name}</p>
          `)}
          ${when(this.platform, () => html`
            <p class="c-card-simple__text">${this.platform}</p>
          `)}
          ${when(this.date, () => html`
            <p class="c-card-simple__text">${showDateWithFormat(this.date)}</p>
          `)}
        </div>
        ${when(this.money, () => html`
          <p class="c-card-simple__price">${this.money}€</p>
        `)}
      </div>
    `
  }
}