import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'

// Styles
import style from './c-card.style.scss?inline'

@customElement('c-card')
class CCard extends LitElement {

  @property({ type: String }) name = ''

  @property({ type: String }) image = ''

  @property({ type: Array }) consoles = []

  @property({ type: Array }) platforms = []

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
        ${when(this.platforms.length > 0, () => html`
          <div class="c-card__platforms">
            ${map(this.platforms, (platform: string) => html`
              <img class="c-card__platform" src="/images/logos/${platform}.png" alt="Logo ${platform}" width="8" height="8" />
            `)}
          </div>
        `)}
        <div class="c-card__caption">
          <p class="c-card__name">${this.name}</p>
        </div>
      </div>
    `
  }
}