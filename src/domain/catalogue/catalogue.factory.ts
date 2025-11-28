import type { Design, Game } from './catalogue.types'

export const CatalogueFactory = {
  gameFromApi(data: any): Game {
    return {
      id: data.id,
      gameName: data.gameName ?? '',
      designs: data.designs ?? [],
      consoles: data.consoles ?? [],
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  },

  designFromApi(data: any): Design {
    return {
      id: data.id,
      designName: data.designName ?? '',
      poster: data.poster ?? '',
      slipcover: data.slipcover ?? '',
      material: data.material ?? '',
      isFavorite: data.isFavorite ?? false,
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}