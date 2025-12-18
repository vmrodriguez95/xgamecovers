import { rtdbService } from '../../firebase/rtdb.service'
import { VersionFactory } from './version.factory'
import type { Version } from './version.types'

const PATH = 'version'

class VersionRepository {
  async getAll(): Promise<Version[]> {
    const data = await rtdbService.getAllOrderedBy(PATH, 'order')

    return data.map(VersionFactory.fromApi)
  }

  async getById(id: string): Promise<Version | null> {
    const data = await rtdbService.getById(PATH, id)

    return data ? VersionFactory.fromApi(data) : null
  }
}

export const versionRepository = new VersionRepository()