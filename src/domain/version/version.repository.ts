import { rtdbService } from '../../firebase/rtdb.service'
import { VersionFactory } from './version.factory'
import type { Version } from './version.types'

const PATH = 'version'

class VersionRepository {
  async getAll(): Promise<Version[]> {
    const data = await rtdbService.getAll(PATH)

    return data.map(VersionFactory.fromApi)
  }

  async getById(id: string): Promise<Version | null> {
    const data = await rtdbService.getById(PATH, id)

    return data ? VersionFactory.fromApi(data) : null
  }

  async create(data: Console) {
    await rtdbService.set(PATH, data)
  }

  async update(id: string, partial: Partial<Console>) {
    await rtdbService.update(PATH, id, partial)
  }

  async delete(id: string) {
    await rtdbService.delete(PATH, id)
  }
}

export const versionRepository = new VersionRepository()