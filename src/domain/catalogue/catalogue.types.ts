export interface Design {
  id: string
  name: string
  posterUrl: string
  slipcoverUrl: string
  createdAt: string
  updatedAt: string
}

export interface Game {
  id: string
  name: string
  designs: string[]
  consoles: string[]
  createdAt: string
  updatedAt: string
}