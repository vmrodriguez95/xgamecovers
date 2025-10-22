import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { ALayout } from '../../mixins/layout.mixin.ts'

// Styles
import style from './v-catalogue.style.scss?inline'

const covers = [
  {
    name: 'Assassin\'s creed Syndicate',
    image: '/images/covers/assassins-creed-syndicate.webp',
    platforms: ['playstation', 'pc', 'xbox']
  },
  {
    name: 'Burnout Paradise',
    image: '/images/covers/burnout-paradise.webp',
    platforms: ['playstation', 'pc', 'xbox']
  },
  {
    name: 'Death Stranding',
    image: '/images/covers/death-stranding.webp',
    platforms: ['playstation', 'pc', 'xbox']
  },
  {
    name: 'Halo',
    image: '/images/covers/halo.webp',
    platforms: ['xbox', 'pc']
  },
  {
    name: 'Ratchet and Clank',
    image: '/images/covers/ratchet-and-clan.webp',
    platforms: ['playstation', 'xbox', 'pc']
  },
  {
    name: 'Uncharted 4',
    image: '/images/covers/uncharted-4.webp',
    platforms: ['playstation', 'xbox', 'pc', 'switch']
  }
]

@customElement('v-catalogue')
class VCatalogue extends ALayout(LitElement) {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue">
        <c-search class="v-catalogue__search"></c-search>
        <c-filters class="v-catalogue__filters"></c-filters>
        ${map(covers, (cover) => html`
          <c-card name=${cover.name} image=${cover.image} .platforms=${cover.platforms}></c-card>
        `)}
      </div>
    `)
  }
}