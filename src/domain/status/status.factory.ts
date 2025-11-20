import type { Status } from './status.types'

export const StatusFactory = {
  fromApi(data: any): Status {
    return {
      id: data.id,
      name: data.name ?? '',
      color: data.color ?? ''
    }
  }
}