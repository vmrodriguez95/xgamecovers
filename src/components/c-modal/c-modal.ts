import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Styles
import style from './c-modal.style.scss?inline'

@customElement('c-modal')
export class CModal extends LitElement {

  @property({ type: Boolean, reflect: true }) open = false

  static styles = css`${unsafeCSS(style)}`

  protected firstUpdated(): void {
    setTimeout(() => {
      this.open = true
    }, 0)
  }

  render() {
    return html`
      <div class="c-modal__backdrop" @click=${this._hide}></div>
      <div class="c-modal">
        <div class="c-modal__container">
          <slot></slot>
        </div>
      </div>
    `
  }

  private _hide() {
    this.open = false
    
    setTimeout(() => {
      this.dispatchEvent(new Event('close'))
    }, 300)
  }

  show() {
    this.open = true
  }
}