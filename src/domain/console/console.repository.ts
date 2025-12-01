import { rtdbService } from '../../firebase/rtdb.service'
import { ConsoleFactory } from './console.factory'
import type { Console, Version } from './console.types'

const PATH_CONSOLE = 'console'
const PATH_VERSION = 'version'

class ConsoleRepository {
  async getAll(): Promise<Console[]> {
    const data = await rtdbService.getAll(PATH_CONSOLE)
    return data.map(ConsoleFactory.fromApi)
  }

  async getById(id: string): Promise<Console | null> {
    const data = await rtdbService.getById(PATH_CONSOLE, id)
    return data ? ConsoleFactory.fromApi(data) : null
  }

  async create(data: Console) {
    await rtdbService.set(PATH_CONSOLE, data)
  }

  async update(id: string, partial: Partial<Console>) {
    await rtdbService.update(PATH_CONSOLE, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH_CONSOLE, id)
  }
}

export const consoleRepository = new ConsoleRepository()