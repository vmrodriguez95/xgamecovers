import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

// Styles
import style from './c-card.style.scss?inline'

@customElement('c-card')
class CCard extends LitElement {

  @property({ type: String }) name = ''

  @property({ type: String }) image = ''

  @property({ type: Array }) consoles = []

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-card">
        <img class="c-card__background" src=${this.image} alt=${this.name} loading="lazy" />
        <div class="c-card__consoles">
          ${map(this.consoles, (console: string) => html`
            <e-icon icon=${console} size="xs"></e-icon>
          `)}
        </div>
        <div class="c-card__caption">
          <p class="c-card__name">${this.name}</p>
        </div>
      </div>
    `
  }
}