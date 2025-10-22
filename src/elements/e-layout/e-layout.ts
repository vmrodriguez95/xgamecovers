import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

// Styles
import style from './e-layout.style.scss?inline'

@customElement('e-layout')
class ELayout extends LitElement {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="e-layout">
        <c-header></c-header>
        <div class="e-layout__main">
          <slot></slot>
        </div>
      </div>
    `
  }
}