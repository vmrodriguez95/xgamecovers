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
    platforms: ['Playstation', 'PC', 'Xbox']
  },
  {
    name: 'Burnout Paradise',
    image: '/images/covers/burnout-paradise.webp',
    platforms: ['Playstation', 'PC', 'Xbox']
  },
  {
    name: 'Death Stranding',
    image: '/images/covers/death-stranding.webp',
    platforms: ['Playstation', 'PC', 'Xbox']
  },
  {
    name: 'Halo',
    image: '/images/covers/halo.webp',
    platforms: ['Xbox', 'PC']
  },
  {
    name: 'Ratchet and Clan',
    image: '/images/covers/ratchet-and-clan.webp',
    platforms: ['Playstation', 'Xbox', 'PC']
  },
  {
    name: 'Uncharted 4',
    image: '/images/covers/uncharted-4.webp',
    platforms: ['Playstation', 'Xbox', 'PC']
  }
]

@customElement('v-catalogue')
class VCatalogue extends ALayout(LitElement) {

  static styles = css`${unsafeCSS(style)}`

  render() {
    return this.layoutGrid(html`
      <div class="v-catalogue">
        ${map(covers, (cover) => html`
          <c-card name=${cover.name} image=${cover.image} .platforms=${cover.platforms}></c-card>
        `)}
      </div>
    `)
  }
}