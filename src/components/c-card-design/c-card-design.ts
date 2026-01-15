import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { Status } from '../../domain/status/status.types'

// Styles
import style from './c-card-design.style.scss?inline'

@customElement('c-card-design')
class CCardDesign extends LitElement {

  @property({ type: String }) status!: Status

  @property({ type: String }) name = ''

  @property({ type: String }) version = ''

  @property({ type: String }) combination = ''
  
  @property({ type: String }) money = ''

  @property({ type: String }) poster = ''
  
  static styles = css`${unsafeCSS(style)}`

  render() {
    const classes = classMap({
      'c-card-design': true,
      [`c-card-design--${this.status?.color}`]: true
    })

    return html`
      <div class=${classes}>
        <div class="c-card-design__status">
          <button class="c-card-design__status__text" @click=${this._launchStatusChange}>${this.status?.name}</button>
        </div>
        <div class="c-card-design__info">
          <img class="c-card-design__image" src=${this.poster} alt=${this.name}>
          <div class="c-card-design__middle">
            <p class="c-card-design__text">${this.name}</p>
            <p class="c-card-design__text">${this.version}</p>
            <p class="c-card-design__text">${this.combination}</p>
          </div>
          <p class="c-card-design__price">${this.money}€</p>
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