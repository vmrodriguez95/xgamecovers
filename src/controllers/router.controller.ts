import { html } from 'lit'
import { StrictRouteConfig } from '../domain/router/router.types'
import { authService } from '../firebase/auth.service'

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
      `,
      enter: this._middleware
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
      `,
      enter: this._middleware
    },
    transaction: {
      path: '/transaction',
      render: () => html`
        <v-transaction></v-transaction>
      `,
      enter: this._middleware
    },
    transactionNew: {
      path: '/transaction/new',
      render: () => html`
        <v-transaction-new></v-transaction-new>
      `,
      enter: this._middleware
    },
    transactionEdit: {
      path: '/transaction/:id',
      render: (params: Object) => html`
        <v-transaction-edit .urlParams=${params}></v-transaction-edit>
      `,
      enter: this._middleware
    },
    order: {
      path: '/order',
      render: () => html`
        <v-order heading="Pedidos"></v-order>
      `,
      enter: this._middleware
    },
    orderNew: {
      path: '/order/new',
      render: () => html`
        <v-order-new heading="Nuevo Pedido"></v-order-new>
      `,
      enter: this._middleware
    },
    orderEdit: {
      path: '/order/edit/:id',
      render: (params: Object) => html`
        <v-order-edit .urlParams=${params}></v-order-edit>
      `,
      enter: this._middleware
    },
    orderView: {
      path: '/order/:id',
      render: (params: Object) => html`
        <v-order-view .urlParams=${params}></v-order-view>
      `,
      enter: this._middleware
    },
    orderItem: {
      path: '/order-item/:idOrder',
      render: (urlParams) => html`
        <v-order-item .urlParams=${urlParams}></v-order-item>
      `,
      enter: this._middleware
    },
    // orderItemAdd: {
    //   path: '/order-item/:idOrder/add/:idGame',
    //   render: (urlParams) => html`
    //     <v-order-item-add .urlParams=${urlParams}></v-order-item-add>
    //   `,
    //   enter: this._middleware
    // },
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
      routeReplaced = route.replace(`:${key}`, value)
    })

    return routeReplaced
  }

  private async _middleware(): Promise<boolean> {
    return new Promise((resolve) => {
      authService.listenAuthChanges((user) => {
        if (!user) {
          location.href = '/'
          resolve(false)
        }
    
        resolve(true)
      })
    })
  }

  getRoutes() {
    return Object.values(this.routes)
  }

  getAdminRoute(key: string, params: object): string {
    const { path } = this.routes[key]

    return this._replaceParams(path, params)
  }
}
