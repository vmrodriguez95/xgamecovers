import type { Client } from './client.types'

export const ClientFactory = {
  fromApi(data: any): Client {
    return {
      id: data.id,
      name: data.name ?? '',
      whatsapp: data.whatsapp ?? '',
      wallapop: data.wallapop ?? '',
      instagram: data.instagram ?? '',
      vinted: data.vinted ?? '',
      address: data.address ?? '',
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}