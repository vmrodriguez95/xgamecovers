import { rtdbService } from '../../firebase/rtdb.service'
import { ConsoleFactory } from './console.factory'
import type { Console } from './console.types'

const PATH_CONSOLE = 'console'

class ConsoleRepository {
  async getAll(): Promise<Console[]> {
    const data = await rtdbService.getAllOrderedBy(PATH_CONSOLE, 'order')
    return data.map(ConsoleFactory.fromApi)
  }

  async getById(id: string): Promise<Console | null> {
    const data = await rtdbService.getById(PATH_CONSOLE, id)
    return data ? ConsoleFactory.fromApi(data) : null
  }
}

export const consoleRepository = new ConsoleRepository()