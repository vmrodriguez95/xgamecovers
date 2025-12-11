import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'

// Types
import { Status } from '../../domain/status/status.types'

// Styles
import style from './c-card-order.style.scss?inline'

@customElement('c-card-order')
class CCardOrder extends LitElement {

  @property({ type: String }) status: Status | undefined

  @property({ type: String }) name = ''

  @property({ type: String }) date = ''
  
  @property({ type: String }) money = ''
  
  @property({ type: Array }) rrss = []

  @property({ type: Number }) totalItems = 0

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-card-order c-card-order--${this.status?.color}">
        <div class="c-card-order__status">
          <p class="c-card-order__status__text">${this.status?.name}</p>
        </div>
        <div class="c-card-order__info">
          <div class="c-card-order__start">
            <div class="c-card-order__avatar c-card-order__avatar--${this.status?.color}">
              <e-icon icon="person" size="xl"></e-icon>
            </div>
          </div>
          <div class="c-card-order__middle">
            <p class="c-card-order__text">${this.name}</p>
            ${map(this.rrss, (rs: any) => when(rs.name !== '', () => html`
              <p class="c-card-order__text">
                <img src="/images/logos/${rs.logo}.png" alt="Logo ${rs.name}" width="16" height="16" />
                ${rs.name}
              </p>
            `))}
            <p class="c-card-order__text">${this.totalItems} diseños</p>
          </div>
          <div class="c-card-order__end">
            <p class="c-card-order__price">${this.money}€</p>
            <p class="c-card-order__text">${this._showDateWithFormat(this.date)}</p>
          </div>
        </div>
      </div>
    `
  }

  private _showDateWithFormat(date: string) {
    const dateObj = new Date(date)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()

    return `${day}/${month}/${year}`
  }
}