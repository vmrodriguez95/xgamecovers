import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ALayout } from '../../mixins/layout.mixin.ts'

import { COVERS } from '../../utils/consts.utils.ts'

// Styles
import style from './v-catalogue-edit.style.scss?inline'

@customElement('v-catalogue-edit')
class VCatalogueEdit extends ALayout(LitElement) {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue-edit">
        <h1>Edición</h1>
      </div>
    `)
  }
}