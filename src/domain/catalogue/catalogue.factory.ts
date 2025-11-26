import type { Design, Game } from './catalogue.types'

export const CatalogueFactory = {
  gameFromApi(data: any): Game {
    return {
      id: data.id,
      name: data.name ?? '',
      designs: data.designs ?? [],
      consoles: data.consoles ?? [],
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  },

  designFromApi(data: any): Design {
    return {
      id: data.id,
      name: data.name ?? '',
      posterUrl: data.posterUrl ?? '',
      slipcoverUrl: data.slipcoverUrl ?? '',
      createdAt: data.createdAt ?? '',
      updatedAt: data.updatedAt ?? ''
    }
  }
}