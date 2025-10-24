// API CONSTS
export const API_HOST = 'http://localhost:3000'

// Storage consts
export const STORAGE = localStorage
export const STORAGE_KEY_NAME = 'catalogue'

export const METHODS = {
  GET_INFO: 'GET',
  CREATE: 'POST',
  UPDATE: 'PUT',
  PARTIAL_UPDATE: 'PATCH',
  DELETE: 'DELETE'
}

export const COVERS = [
  {
    id: 0,
    name: 'Assassin\'s creed Syndicate',
    image: '/images/covers/assassins-creed-syndicate.webp',
    platforms: ['playstation', 'pc', 'xbox']
  },
  {
    id: 1,
    name: 'Burnout Paradise',
    image: '/images/covers/burnout-paradise.webp',
    platforms: ['playstation', 'pc', 'xbox']
  },
  {
    id: 2,
    name: 'Death Stranding',
    image: '/images/covers/death-stranding.webp',
    platforms: ['playstation', 'pc', 'xbox']
  },
  {
    id: 3,
    name: 'Halo',
    image: '/images/covers/halo.webp',
    platforms: ['xbox', 'pc']
  },
  {
    id: 4,
    name: 'Ratchet and Clank',
    image: '/images/covers/ratchet-and-clan.webp',
    platforms: ['playstation', 'xbox', 'pc']
  },
  {
    id: 5,
    name: 'Uncharted 4',
    image: '/images/covers/uncharted-4.webp',
    platforms: ['playstation', 'xbox', 'pc', 'switch']
  }
]
