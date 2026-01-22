import { rtdbService } from '../../firebase/rtdb.service'
import { GameFactory } from './game.factory'
import type { Game } from './game.types'

const PATH = 'game'

class GameRepository {
  async getAll(): Promise<Game[]> {
    const data = await rtdbService.getAllOrderedBy<Game>(PATH, 'name')

    return data.map(GameFactory.fromApi)
  }

  async getById(id: string): Promise<Game | null> {
    const data = await rtdbService.getById<Game>(PATH, id)

    return data ? GameFactory.fromApi(data) : null
  }

  async create(data: Game) {
    return await rtdbService.set<Game>(PATH, data)
  }

  async update(id: string, partial: Partial<Game>) {
    await rtdbService.update<Game>(PATH, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }
}

export const gameRepository = new GameRepository()