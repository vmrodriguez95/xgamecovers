import { rtdbService } from '../../firebase/rtdb.service'
import { GameFactory } from './game.factory'
import type { Game } from './game.types'

const PATH_GAMES = 'game'

class GameRepository {
  async getAll(): Promise<Game[]> {
    const data = await rtdbService.getAll<Game>(PATH_GAMES)

    return data.map(GameFactory.fromApi)
  }

  async getAllOrderedBy(orderedBy: string): Promise<Game[]> {
    const data = await rtdbService.getAllOrderedBy<Game>(PATH_GAMES, orderedBy)

    return data.map(GameFactory.fromApi)
  }

  async getById(id: string): Promise<Game | null> {
    const data = await rtdbService.getById<Game>(PATH_GAMES, id)

    return data ? GameFactory.fromApi(data) : null
  }

  async create(data: Game) {
    return await rtdbService.set<Game>(PATH_GAMES, data)
  }

  async update(id: string, partial: Partial<Game>) {
    await rtdbService.update<Game>(PATH_GAMES, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH_GAMES, id)
  }
}

export const gameRepository = new GameRepository()