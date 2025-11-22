import { AuthUser } from './auth.types'
import type { User } from 'firebase/auth'
import {
  logout,
  getCurrentUser,
  loginWithGoogle,
  listenAuthChanges
} from '../../firebase/auth.service'

function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) return null
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  }
}

export const authRepository = {
  getCurrentUser(): AuthUser | null {
    return mapFirebaseUser(getCurrentUser())
  },

  login(): Promise<AuthUser> {
    return loginWithGoogle().then(user => {
      const mapped = mapFirebaseUser(user)
      if (!mapped) {
        throw new Error('Login failed: no user returned')
      }
      return mapped
    })
  },

  logout(): Promise<void> {
    return logout()
  },

  onAuthChange(callback: (user: AuthUser | null) => void) {
    return listenAuthChanges(user => callback(mapFirebaseUser(user)))
  }
}