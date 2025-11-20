import { Console } from '../console/console.types'

export interface Design {
  id: number,
  name: string,
  poster: string
}

export interface Game {
  id: number,
  name: string,
  consoles: Console[],
}