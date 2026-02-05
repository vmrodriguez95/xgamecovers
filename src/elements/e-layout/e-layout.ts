import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Styles
import style from './e-layout.style.scss?inline'

@customElement('e-layout')
class ELayout extends LitElement {

  @property({ type: String }) heading = ''

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="e-layout">
        <c-header heading=${this.heading}></c-header>
        <div class="e-layout__main">
          <slot></slot>
          <c-menu></c-menu>
        </div>
      </div>
    `
  }
}