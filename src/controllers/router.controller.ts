import { html } from 'lit'
import { StrictRouteConfig } from '../domain/router/router.types'
import { authService } from '../firebase/auth.service'
import { auth } from '../firebase'
import { authStore } from '../domain/auth/auth.store'

export class RouterController {
  host

  routes: Record<string, StrictRouteConfig> = {
    home: {
      path: '/',
      render: () => html`
        <v-catalogue></v-catalogue>
      `
    },
    catalogue: {
      path: '/catalogue',
      render: () => html`
        <v-catalogue></v-catalogue>
      `
    },
    catalogueNew: {
      path: '/catalogue/new',
      enter: this._middleware,
      render: () => html`
        <v-catalogue-new></v-catalogue-new>
      `
    },
    catalogueGame: {
      path: '/catalogue/game/:id',
      enter: this._middleware,
      render: (params: Object) => html`
        <v-catalogue-game .urlParams=${params}></v-catalogue-game>
      `,
    },
    catalogueEdit: {
      path: '/catalogue/edit/:id',
      enter: this._middleware,
      render: (params: Object) => html`
        <v-catalogue-edit .urlParams=${params}></v-catalogue-edit>
      `
    },
    transaction: {
      path: '/transaction',
      enter: this._middleware,
      render: () => html`
        <v-transaction></v-transaction>
      `
    },
    transactionNew: {
      path: '/transaction/new',
      enter: this._middleware,
      render: () => html`
        <v-transaction-new></v-transaction-new>
      `
    },
    transactionEdit: {
      path: '/transaction/:id',
      enter: this._middleware,
      render: (params: Object) => html`
        <v-transaction-edit .urlParams=${params}></v-transaction-edit>
      `
    },
    order: {
      path: '/order',
      enter: this._middleware,
      render: () => html`
        <v-order heading="Pedidos"></v-order>
      `
    },
    orderNew: {
      path: '/order/new',
      enter: this._middleware,
      render: () => html`
        <v-order-new heading="Nuevo Pedido"></v-order-new>
      `
    },
    orderEdit: {
      path: '/order/edit/:id',
      enter: this._middleware,
      render: (params: Object) => html`
        <v-order-edit .urlParams=${params}></v-order-edit>
      `
    },
    orderView: {
      path: '/order/:id',
      enter: this._middleware,
      render: (params: Object) => html`
        <v-order-view .urlParams=${params}></v-order-view>
      `
    },
    orderItem: {
      path: '/order-item/:idOrder',
      enter: this._middleware,
      render: (urlParams) => html`
        <v-order-item .urlParams=${urlParams}></v-order-item>
      `
    },
    orderItemAdd: {
      path: '/order-item/:idOrder/add/:idGame',
      enter: this._middleware,
      render: (urlParams) => html`
        <v-order-item-add .urlParams=${urlParams}></v-order-item-add>
      `
    },
    orderItemEdit: {
      path: '/order-item/:idOrder/edit/:idOrderItem',
      enter: this._middleware,
      render: (urlParams) => html`
        <v-order-item-edit .urlParams=${urlParams}></v-order-item-edit>
      `,
    },
    error: {
      path: '(.*)',
      enter: () => {
        location.href = '/'
        return false
      }
    }
  }

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
  private _replaceParams(route: string, params: object): string {
    let routeReplaced = route

    Object.entries(params).forEach(([key, value]) => {
      routeReplaced = routeReplaced.replace(`:${key}`, value)
    })

    return routeReplaced
  }

  private _middleware() {
    if (!authStore.isLogged()) {
      location.href = '/'
      return false
    }

    return true
  }

  getRoutes() {
    return Object.values(this.routes)
  }

  getAdminRoute(key: string, params: object): string {
    const { path } = this.routes[key]

    return this._replaceParams(path, params)
  }
}
