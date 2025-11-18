import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

import { COVERS } from '../../utils/consts.utils.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './v-catalogue.style.scss?inline'

@customElement('v-catalogue')
class VCatalogue extends LayoutMixin(LitElement) {

  routerController = new RouterController(this)

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue">
        <c-search class="v-catalogue__search"></c-search>
        <c-filters class="v-catalogue__filters"></c-filters>
        ${map(COVERS, (cover) => html`
          <a class="v-catalogue__link" href="${this.routerController.getAdminRoute('catalogueEdit', { id: cover.id })}">
            <c-card
              name=${cover.name}
              image=${cover.poster}
              .platforms=${cover.platforms}
            ></c-card>
          </a>
        `)}
      </div>
    `)
  }
}