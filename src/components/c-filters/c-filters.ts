import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { classMap } from 'lit/directives/class-map.js'

// Styles
import style from './c-filters.style.scss?inline'

const platforms = [
  {
    id: 0,
    name: 'Playstation',
    icon: 'playstation',
    color: 'blue'
  },
  {
    id: 1,
    name: 'XBox',
    icon: 'xbox',
    color: 'green'
  },
  {
    id: 2,
    name: 'Switch',
    icon: 'switch',
    color: 'red'
  },
  {
    id: 3,
    name: 'PC',
    icon: 'pc',
    color: 'black'
  },
]

@customElement('c-filters')
class CFilters extends LitElement {

  @state() lastFilterActivated = -1;

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <div class="c-filters">
        ${map(platforms, (platform, index) => html`
          <button
            class="${this.getButtonClasses(platform.color, index)}"
            @click=${() => this.setLastFilterActivated(index)}
          >
            <e-icon icon=${platform.icon}></e-icon>
          </button>
        `)}
      </div>
    `
  }

  /*
   Methods
   */
  getButtonClasses(color: string, index: number) {
    return classMap({
      'c-filters__platform': true,
      [`c-filters__platform--${color}`]: true,
      'c-filters__platform--active': this.lastFilterActivated === index,
    })
  }

  setLastFilterActivated(index: number) {
    this.lastFilterActivated = this.lastFilterActivated === index ? -1 : index
  }
}