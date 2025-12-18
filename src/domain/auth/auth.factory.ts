import { AuthUser } from './auth.types'
import type { User } from 'firebase/auth'

export const AuthFactory = {
  fromApi(user: User | null): AuthUser | null {
    if (!user) return null

    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: ''
    }
  }
}