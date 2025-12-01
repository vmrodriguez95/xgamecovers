import { rtdbService } from '../../firebase/rtdb.service'
import { CatalogueFactory } from './catalogue.factory'
import type { Game, Design } from './catalogue.types'

const PATH_GAMES = 'game'
const PATH_DESIGNS = 'design'

class CatalogueGameRepository {
  async getAll(): Promise<Game[]> {
    const data = await rtdbService.getAll(PATH_GAMES)
    return data.map(CatalogueFactory.gameFromApi)
  }

  async getById(id: string): Promise<Game | null> {
    const data = await rtdbService.getById(PATH_GAMES, id)
    return data ? CatalogueFactory.gameFromApi(data) : null
  }

  async create(data: Game) {
    await rtdbService.set(PATH_GAMES, data)
  }

  async update(id: string, partial: Partial<Game>) {
    await rtdbService.update(PATH_GAMES, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH_GAMES, id)
  }
}

class CatalogueDesignRepository {
  async getAll(): Promise<Design[]> {
    const data = await rtdbService.getAll(PATH_DESIGNS)
    return data.map(CatalogueFactory.designFromApi)
  }

  async getById(id: string): Promise<Design | null> {
    const data = await rtdbService.getById(PATH_DESIGNS, id)
    return data ? CatalogueFactory.designFromApi(data) : null
  }

  async create(data: Design) {
    await rtdbService.set(PATH_DESIGNS, data)
  }

  async update(id: string, partial: Partial<Design>) {
    await rtdbService.update(PATH_DESIGNS, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH_DESIGNS, id)
  }
}

export const catalogueGameRepository = new CatalogueGameRepository()
export const catalogueDesignRepository = new CatalogueDesignRepository()