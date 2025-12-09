import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Types
import { EButton } from '../../elements/e-button/e-button'

// Styles
import style from './c-confirm.style.scss?inline'

@customElement('c-confirm')
export class CConfirm extends LitElement {

  @property({ type: String }) message = ''

  @property({ type: Boolean, reflect: true }) open = false

  _resolver: ((value: boolean) => void) | null = null

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-confirm__backdrop" @click=${this._cancel}></div>
      <div class="c-confirm">
        <div class="c-confirm__container">
          <p class="c-confirm__message">${this.message}</p>
          <div class="c-confirm__actions">
            <e-button @click=${this._cancel}>Cancelar</e-button>
            <e-button @click=${this._accept}>Aceptar</e-button>
          </div>
        </div>
      </div>
    `
  }

  private _accept(ev: Event) {
    const button = ev.currentTarget as EButton

    button.loading = true

    this._hide()
    this._resolver && this._resolver(true)
  }

  private _cancel() {
    this._hide()
    this._resolver && this._resolver(false)
  }

  private _hide() {
    this.open = false

    setTimeout(() => {
      this.remove()
    }, 300)
  }

  show(message: string): Promise<boolean> {
    this.message = message

    setTimeout(() => {
      this.open = true
    }, 0)

    return new Promise(resolve => {
      this._resolver = resolve
    })
  }
}