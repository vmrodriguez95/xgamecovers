import type { Game } from './game.types'

export const GameFactory = {
  fromApi(data: any): Game {
    return {
      id: data.id,
      name: data.name ?? '',
      consoles: data.consoles ?? [],
      socialMedia: data.socialMedia ?? [],
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}