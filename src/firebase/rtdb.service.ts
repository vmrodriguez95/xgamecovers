import {
  ref,
  get,
  set,
  update,
  remove
} from 'firebase/database'
import { rtdb } from './index'

export class RTDBService {
  ref(path: string) {
    return ref(rtdb, path)
  }

  async getAll<T>(path: string): Promise<T[]> {
    const snapshot = await get(this.ref(path))
    const data = snapshot.val()
    if (!data) return []

    return Object.entries(data).map(([id, value]) => ({
      id,
      ...(value as object)
    })) as T[]
  }

  async getById<T>(path: string, id: string): Promise<T | null> {
    const snapshot = await get(this.ref(`${path}/${id}`))

    return snapshot.exists()
      ? ({ id, ...snapshot.val() } as T)
      : null
  }

  set<T>(path: string, id: string, data: T) {
    return set(this.ref(`${path}/${id}`), data)
  }

  update<T>(path: string, id: string, partial: Partial<T>) {
    return update(this.ref(`${path}/${id}`), partial)
  }

  delete(path: string, id: string) {
    return remove(this.ref(`${path}/${id}`))
  }
}

export const rtdbService = new RTDBService()