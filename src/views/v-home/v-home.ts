import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ALayout } from '../../mixins/layout.mixin.ts'

// Styles
import style from './v-home.style.scss?inline'

@customElement('v-home')
class VHome extends ALayout(LitElement) {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(html`
      <div class="v-home">
        <h1>Home</h1>
      </div>
    `)
  }
}