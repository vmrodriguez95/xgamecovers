import { html } from 'lit'
import { Route } from '../domain/router/router.types'
import { authStore } from '../domain/auth/auth.store'

export class RouterController {
  host

  routes: Record<string, Route> = {
    home: {
      path: '/',
      render: () => html`
        <v-home></v-home>
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
      render: () => html`
        <v-catalogue-new></v-catalogue-new>
      `,
      enter: this._middleware
    },
    catalogueEdit: {
      path: '/catalogue/:id',
      render: (params: Object) => html`
        <v-catalogue-edit .urlParams=${params}></v-catalogue-edit>
      `,
      enter: this._middleware
    },
    transactions: {
      path: '/transaction',
      render: () => html`
        <v-transactions></v-transactions>
      `,
      enter: this._middleware
    },
    transactionsNew: {
      path: '/transaction/new',
      render: () => html`
        <v-transactions-create></v-transactions-create>
      `,
      enter: this._middleware
    },
    transactionsEdit: {
      path: '/transaction/:id',
      render: (params: Object) => html`
        <v-transactions-edit .urlParams=${params}></v-transactions-edit>
      `,
      enter: this._middleware
    },
    orders: {
      path: '/order',
      render: () => html`
        <v-order heading="Pedidos"></v-order>
      `,
      enter: this._middleware
    },
    ordersNew: {
      path: '/order/new',
      render: () => html`
        <v-order-new heading="Nuevo Pedido"></v-order-new>
      `,
      enter: this._middleware
    },
    ordersEdit: {
      path: '/order/:id',
      render: (params: Object) => html`
        <v-order-edit .urlParams=${params}></v-order-edit>
      `,
      enter: this._middleware
    },
    error: {
      path: '(.*)',
      enter: () => {
        return location.href = '/404'
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
  private _replaceParams(route: string, params: object) {
    let routeReplaced

    Object.entries(params).forEach(([key, value]) => {
      routeReplaced = route.replace(`:${key}`, value)
    })

    return routeReplaced
  }

  private _middleware() {
    if (!authStore.user) {
      location.href = '/'
    }
  }

  getAdminRoute(key: string, params: object) {
    return this._replaceParams(this.routes[key].path, params)
  }
}
