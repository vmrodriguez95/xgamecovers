import {
  ref,
  get,
  set,
  push,
  query,
  update,
  remove,
  equalTo,
  orderByChild
} from 'firebase/database'
import { rtdb } from './index'

class RTDBService {
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

  async filterByChild<T>(path: string, child: string, id: string): Promise<T[]> {
    const ref = this.ref(path)

    const snapshot = await get(
      query(
        ref,
        orderByChild(child),
        equalTo(id)
      )
    )

    if (!snapshot.exists()) return []

    return Object.values(snapshot.val())
  }

  async set<T>(path: string, data: T) {
    const newRef = push(this.ref(path))
    const technicalId = newRef.key

    if (!technicalId) return null

    await set(
      newRef,
      {
        ...data,
        id: technicalId,
        createdAt: new Date().toISOString(),
      }
    )

    return technicalId
  }

  update<T>(path: string, id: string, partial: Partial<T>) {
    return update(this.ref(`${path}/${id}`), {
      ...partial,
      updatedAt: new Date().toISOString(),
    })
  }

  delete(path: string, id: string) {
    return remove(this.ref(`${path}/${id}`))
  }
}

export const rtdbService = new RTDBService()