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
      render: () => html`
        <v-catalogue-new></v-catalogue-new>
      `
    },
    catalogueGame: {
      path: '/catalogue/game/:id',
      render: (params: Object) => html`
        <v-catalogue-game .urlParams=${params}></v-catalogue-game>
      `,
    },
    catalogueEdit: {
      path: '/catalogue/edit/:id',
      render: (params: Object) => html`
        <v-catalogue-edit .urlParams=${params}></v-catalogue-edit>
      `
    },
    transaction: {
      path: '/transaction',
      render: () => html`
        <v-transaction heading="Transacciones"></v-transaction>
      `
    },
    transactionNew: {
      path: '/transaction/new',
      render: () => html`
        <v-transaction-new heading="Transacciones"></v-transaction-new>
      `
    },
    transactionEdit: {
      path: '/transaction/:id',
      render: (params: Object) => html`
        <v-transaction-edit .urlParams=${params}></v-transaction-edit>
      `
    },
    order: {
      path: '/order',
      render: () => html`
        <v-order heading="Pedidos"></v-order>
      `
    },
    orderNew: {
      path: '/order/new',
      render: () => html`
        <v-order-new heading="Nuevo Pedido"></v-order-new>
      `
    },
    orderEdit: {
      path: '/order/edit/:id',
      render: (params: Object) => html`
        <v-order-edit .urlParams=${params}></v-order-edit>
      `
    },
    orderView: {
      path: '/order/:id',
      render: (params: Object) => html`
        <v-order-view .urlParams=${params}></v-order-view>
      `
    },
    orderItem: {
      path: '/order-item/:idOrder',
      render: (urlParams) => html`
        <v-order-item .urlParams=${urlParams}></v-order-item>
      `
    },
    orderItemNew: {
      path: '/order-item/:idOrder/new/:idGame',
      render: (urlParams) => html`
        <v-order-item-new .urlParams=${urlParams}></v-order-item-new>
      `
    },
    orderItemEdit: {
      path: '/order-item/:idOrder/edit/:idOrderItem',
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
