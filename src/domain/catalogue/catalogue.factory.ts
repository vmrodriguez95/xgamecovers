import type { Design, Game } from './catalogue.types'

export const CatalogueFactory = {
  gameFromApi(data: any): Game {
    return {
      id: data.id,
      name: data.name ?? '',
      consoles: data.consoles ?? [],
      socialMedia: data.socialMedia ?? [],
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  },

  designFromApi(data: any): Design {
    return {
      id: data.id,
      idGame: data.idGame ?? '',
      name: data.name ?? '',
      poster: data.poster ?? '',
      slipcover: data.slipcover ?? '',
      material: data.material ?? '',
      isFavorite: data.isFavorite ?? false,
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}