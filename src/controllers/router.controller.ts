import { html } from 'lit'

export class RouterController {
  host

  routes: Object = {
    home: {
      path: '/',
      render: () => html`
        <v-home></v-home>
      `
    },
    login: {
      path: '/scrub',
      render: () => html`
        <v-login></v-login>
      `
    },
    catalogue: {
      path: `/catalogue`,
      render: () => html`
        <v-catalogue></v-catalogue>
      `
    },
    catalogueNew: {
      path: '/catalogue/new',
      render: () => html`
        <v-catalogue-new></v-catalogue-new>
      `,
      // enter: () => {}
    },
    catalogueEdit: {
      path: `/catalogue/:id`,
      render: (params: Object) => html`
        <v-catalogue-edit .urlParams=${params}></v-catalogue-edit>
      `,
      // enter: () => {}
    },
    transactions: {
      path: `/transactions`,
      render: () => html`
        <v-transactions></v-transactions>
      `,
      // enter: () => {}
    },
    transactionsNew: {
      path: `/transactions/new`,
      render: () => html`
        <v-transactions-create></v-transactions-create>
      `,
      // enter: () => {}
    },
    transactionsEdit: {
      path: `/transactions/:id`,
      render: (params: Object) => html`
        <v-transactions-edit .urlParams=${params}></v-transactions-edit>
      `,
      // enter: () => {}
    },
    orders: {
      path: `/orders`,
      render: () => html`
        <v-orders></v-orders>
      `,
      // enter: () => {}
    },
    ordersNew: {
      path: `/orders/new`,
      render: () => html`
        <v-orders-create></v-orders-create>
      `,
      // enter: () => {}
    },
    ordersEdit: {
      path: `/orders/:id`,
      render: (params: Object) => html`
        <v-orders-edit .urlParams=${params}></v-orders-edit>
      `,
      // enter: () => {}
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
}
