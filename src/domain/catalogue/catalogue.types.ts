export interface Design {
  id: string
  designName: string
  poster: string
  slipcover: string
  material: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Game {
  id: string
  gameName: string
  designs: string[]
  consoles: string[]
  createdAt: string
  updatedAt: string
}