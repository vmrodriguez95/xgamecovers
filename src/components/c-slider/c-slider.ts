import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { Slide } from './c-slider.types'

// Utils
import { debounce } from '../../utils/events.utils'

// Styles
import style from './c-slider.style.scss?inline'

@customElement('c-slider')
class CSlider extends LitElement {

  @property({ type: Array }) options: Slide[] = []

  @state() _slideActiveInfo!: Slide

  @query('[data-item="slider"]') _slider!: HTMLDivElement

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    this._slideActiveInfo = this.options[0]

    super.connectedCallback()
  }

  render() {
    return html`
      <div class="c-slider__head" data-item="slider" @scroll=${debounce(() => this._onScroll(), 100)}>
        ${map(this.options, (option: Slide) => html`
          <div class="c-slider__slide">
            <img class="c-slider__image" src=${option.image} alt=${option.name} width="398" height="480" />
          </div>
        `)}
      </div>
      <div class="c-slider__bullets">
        ${map(this.options, (option: Slide, index: number) => html`
          <button
            class=${classMap({
              'c-slider__bullet': true,
              'c-slider__bullet--active': option.id === this._slideActiveInfo.id
            })}
            @click=${() => this._changeSlideActive(option, index)}
          >
            <img class="c-slider__preview" src=${option.image} alt=${option.name} width="128" height="72" />
          </button>
        `)}
      </div>
    `
  }

  private _onScroll() {
    const { scrollLeft, scrollWidth } = this._slider
    const position = Math.round(scrollLeft * this.options.length / scrollWidth)

    this._changeSlideActive(this.options[position], position)
  }

  private _changeSlideActive(slide: Slide, position: number) {
    this._slideActiveInfo = slide

    this._slider.scroll({
      left: position * window.innerWidth,
      behavior: 'smooth'
    })

    this.dispatchEvent(new CustomEvent('change', { detail: slide.name }))
  }
}