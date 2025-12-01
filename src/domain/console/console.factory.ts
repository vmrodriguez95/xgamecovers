import type { Console } from './console.types'

export const ConsoleFactory = {
  fromApi(data: any): Console {
    return {
      id: data.id,
      name: data.name ?? '',
      color: data.color ?? '',
      logo: data.logo ?? ''
    }
  }
}