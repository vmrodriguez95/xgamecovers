export interface Design {
  id: string
  idGame: string
  name: string
  poster: string
  slipcover: string
  material: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Game {
  id: string
  name: string
  consoles: string[]
  socialMedia: string[]
  createdAt: string
  updatedAt: string
}