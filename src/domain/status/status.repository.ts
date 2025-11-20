import { rtdbService } from '../../firebase/rtdb.service'
import { StatusFactory } from './status.factory'
import type { Status } from './status.types'

const PATH = 'orderStatus'

export class StatusRepository {
  async getAll(): Promise<Status[]> {
    const data = await rtdbService.getAll(PATH)
    return data.map(StatusFactory.fromApi)
  }

  async getById(id: string): Promise<Status | null> {
    const data = await rtdbService.getById(PATH, id)
    return data ? StatusFactory.fromApi(data) : null
  }
}

export const statusRepository = new StatusRepository()