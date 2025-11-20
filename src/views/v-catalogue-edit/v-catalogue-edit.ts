import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

import { COVERS } from '../../utils/consts.utils.ts'

// Styles
import style from './v-catalogue-edit.style.scss?inline'

@customElement('v-catalogue-edit')
class VCatalogueEdit extends LayoutMixin(LitElement) {

  @property({ type: Object }) urlParams: URLParam = { id: "0" }

  _gameInfo: Cover = {
    id: 0,
    name: '',
    poster: '',
    cover: '',
    platforms: []
  }

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    this._gameInfo = this.getGameInfo() || this._gameInfo

    super.connectedCallback()
  }

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue-edit">
        <div class="v-catalogue-edit__cover">
          <img
            class="v-catalogue-edit__img"
            src=${this._gameInfo.cover}
            alt=${this._gameInfo.name}
          />
        </div>
        <div class="v-catalogue-edit__design">
          ${map(this._gameInfo.designs, (design) => html`
            <img
              class="v-catalogue-edit__design"
              src=${design.poster}
              alt=${design.name}
            />
          `)}
        </div>
        
      </div>
    `)
  }

  /*
   Methods
   */
  getGameInfo(): Cover|undefined {
    const urlID = parseInt(this.urlParams.id)

    return COVERS.find((game) => game.id === urlID)
  }
}