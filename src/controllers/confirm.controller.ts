import { html } from 'lit'
import { CConfirm } from '../components/c-confirm/c-confirm.ts'
import { StrictRouteConfig } from '../domain/router/router.types'
import { authService } from '../firebase/auth.service'

export class ConfirmController {
  host

  _confirmInstance: CConfirm | null = null

  /**
   * constructor - A constructor for initializing the host and adding the controller.
   *
   * @param { type } host - The host to be initialized.
   */
  constructor(host: any) {
    this.host = host
    this.host.addController(this)
  }

  /**
   * hostConnected - A function that runs when the host is connected.
   */
  async hostConnected() {
    // Init dependencies if needed
  }

  /**
   * hostDisconnected - A function that runs when the host is disconnected.
   */
  hostDisconnected() {
    // Clear dependencies when needed
  }

  /**
   * Methods
   */
  init() {
    this._confirmInstance = document.createElement('c-confirm') as CConfirm
    document.body.appendChild(this._confirmInstance)
  }

  async confirm(message: string = '') {
    if (!this._confirmInstance) this.init()

    const userChoise = await this._confirmInstance?.show(message)

    this._confirmInstance = null

    return userChoise
  }
}
