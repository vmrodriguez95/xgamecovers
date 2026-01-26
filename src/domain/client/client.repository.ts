import { rtdbService } from '../../firebase/rtdb.service'
import { ClientFactory } from './client.factory'
import type { Client } from './client.types'

const PATH = 'client'

class ClientRepository {
  async getAll(): Promise<Client[]> {
    const data = await rtdbService.getAllOrderedBy(PATH, 'name')

    return data.map(ClientFactory.fromApi)
  }

  async getById(id: string): Promise<Client | null> {
    const data = await rtdbService.getById<Client>(PATH, id)

    return data ? ClientFactory.fromApi(data) : null
  }

  async create(data: Client) {
    return await rtdbService.set<Client>(PATH, data)
  }

  async update(id: string, partial: Partial<Client>) {
    await rtdbService.update<Client>(PATH, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }
}

export const clientRepository = new ClientRepository()