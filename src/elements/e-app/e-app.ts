import { Router } from '@lit-labs/router'
import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { URLPattern } from 'urlpattern-polyfill'
import { RouterController } from '../../controllers/router.controller.ts'

// Styles
import style from './e-app.style.scss?inline'

// @ts-ignore: Property 'UrlPattern' does not exist 
if (!globalThis.URLPattern) { 
  // @ts-ignore: Property 'UrlPattern' does not exist 
  globalThis.URLPattern = URLPattern
}

@customElement('e-app')
class EApp extends LitElement {

  routerController = new RouterController(this)

  @property({ type: Object }) router: Router = new Router(this, Object.values(this.routerController.routes))

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      ${this.router.outlet()}
    `
  }
}