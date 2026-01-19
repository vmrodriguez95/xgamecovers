import type { Design } from './design.types'

export const DesignFactory = {
  fromApi(data: any): Design {
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