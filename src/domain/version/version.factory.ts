import type { Version } from './version.types'

export const VersionFactory = {
  fromApi(data: any): Version {
    return {
      id: data.id,
      idConsole: data.idConsole,
      name: data.name ?? '',
    }
  }
}