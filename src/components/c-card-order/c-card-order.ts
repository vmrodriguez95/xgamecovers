import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import type { Status } from '../../domain/status/status.types'

// Utils
import { showDateWithFormat } from '../../utils/date.utils'

// Styles
import style from './c-card-order.style.scss?inline'

@customElement('c-card-order')
class CCardOrder extends LitElement {

  @property({ type: String }) status: Status | undefined

  @property({ type: String }) name = ''

  @property({ type: String }) date = ''
  
  @property({ type: String }) money = ''
  
  @property({ type: Array }) rrss = []

  @property({ type: Boolean }) hideStatus = false

  @property({ type: Boolean }) hideDesigns = false

  @property({ type: Number }) totalItems = 0

  static styles = css`${unsafeCSS(style)}`

  render() {
    const classes = classMap({
      'c-card-order': true,
      [`c-card-order--${this.status?.color}`]: true
    })

    return html`
      <div class=${classes}>
        ${when(!this.hideStatus, () => html`
          <div class="c-card-order__status">
            <button
              class="c-card-order__status__text"
              @click=${this._launchStatusChange}
            >${this.status?.name}</button>
          </div>
        `)}
        <div class="c-card-order__info">
          <div class="c-card-order__start">
            <div class="c-card-order__avatar c-card-order__avatar--${this.status?.color}">
              <e-icon icon="person-rounded" size="xxl"></e-icon>
            </div>
          </div>
          <div class="c-card-order__middle">
            <p class="c-card-order__text">${this.name}</p>
            ${map(this.rrss, (rs: any) => when(rs.name !== '', () => html`
              <p class="c-card-order__text">
                <img class="c-card-order__logo" src="/images/logos/${rs.logo}.png" alt="Logo ${rs.name}" width="16" height="16" />
                ${rs.name}
              </p>
            `))}
            ${when(!this.hideDesigns, () => html`
              <p class="c-card-order__text">${this.totalItems} diseños</p>
            `)}
          </div>
          <div class="c-card-order__end">
            <p class="c-card-order__price">${this.money}€</p>
            ${when(this.date, () => html`
              <p class="c-card-order__text">${showDateWithFormat(this.date)}</p>
            `)}
          </div>
        </div>
      </div>
    `
  }

  private _launchStatusChange(ev: Event) {
    ev.preventDefault()
    ev.stopPropagation()

    this.dispatchEvent(new CustomEvent('changeStatus', { bubbles: true, composed: true, cancelable: true }))
  }
}