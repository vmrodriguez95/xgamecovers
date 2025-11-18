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
    poster: '/images/covers/assassins-creed-syndicate.webp',
    cover: '/images/covers/assassins-creed-syndicate.webp',
    platforms: ['playstation', 'pc', 'xbox'],
    designs: [
      {
        id: 0,
        name: 'Assassin\'s creed Syndicate',
        poster: '/images/designs/assassins-creed-syndicate.webp'
      }
    ]
  },
  {
    id: 1,
    name: 'Burnout Paradise',
    poster: '/images/covers/burnout-paradise.webp',
    cover: '/images/covers/burnout-paradise.webp',
    platforms: ['playstation', 'pc', 'xbox'],
    designs: [
      {
        id: 0,
        name: 'Burnout Paradise',
        poster: '/images/designs/burnout-paradise.webp'
      }
    ]
  },
  {
    id: 2,
    name: 'Death Stranding',
    poster: '/images/covers/death-stranding.webp',
    cover: '/images/covers/death-stranding.webp',
    platforms: ['playstation', 'pc', 'xbox'],
    designs: [
      {
        id: 0,
        name: 'Death Stranding',
        poster: '/images/designs/death-stranding.webp'
      }
    ]
  },
  {
    id: 3,
    name: 'Halo',
    poster: '/images/covers/halo.webp',
    cover: '/images/covers/halo.webp',
    platforms: ['xbox', 'pc'],
    designs: [
      {
        id: 0,
        name: 'Halo',
        poster: '/images/designs/halo.webp'
      }
    ]
  },
  {
    id: 4,
    name: 'Ratchet and Clank',
    poster: '/images/covers/ratchet-and-clan.webp',
    cover: '/images/covers/ratchet-and-clan.webp',
    platforms: ['playstation', 'xbox', 'pc'],
    designs: [
      {
        id: 0,
        name: 'Ratchet and Clank',
        poster: '/images/designs/ratchet-and-clank.webp'
      }
    ]
  },
  {
    id: 5,
    name: 'Uncharted 4',
    poster: '/images/covers/uncharted-4.webp',
    cover: '/images/covers/uncharted-4.webp',
    platforms: ['playstation', 'xbox', 'pc', 'switch'],
    designs: [
      {
        id: 0,
        name: 'Uncharted 4',
        poster: '/images/designs/uncharted-4.webp'
      }
    ]
  }
]
