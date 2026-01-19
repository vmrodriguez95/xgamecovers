import { rtdbService } from '../../firebase/rtdb.service'
import { DesignFactory } from './design.factory'
import type { Design } from './design.types'

const PATH_DESIGNS = 'design'

class DesignRepository {
  async getAll(): Promise<Design[]> {
    const data = await rtdbService.getAll(PATH_DESIGNS)

    return data.map(DesignFactory.fromApi)
  }

  async getById(id: string): Promise<Design | null> {
    const data = await rtdbService.getById(PATH_DESIGNS, id)

    return data ? DesignFactory.fromApi(data) : null
  }

  async getByIdGame(idGame: string): Promise<Design[]> {
    const data = await rtdbService.filterByChild(PATH_DESIGNS, 'idGame', idGame)

    return data.map(DesignFactory.fromApi)
  }

  async create(data: Design) {
    return await rtdbService.set(PATH_DESIGNS, data)
  }

  async update(id: string, partial: Partial<Design>) {
    return await rtdbService.update(PATH_DESIGNS, id, partial)
  }

  async delete(id: string) {
    return await rtdbService.delete(PATH_DESIGNS, id)
  }
}

export const designRepository = new DesignRepository()