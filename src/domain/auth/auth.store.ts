import type { AuthUser } from './auth.types'
import { authRepository } from './auth.repository'

class AuthStore {
  user: AuthUser | null = null
  listeners: Array<(user: AuthUser | null) => void> = []

  constructor() {
    authRepository.onAuthChange((user) => {
      this.user = user
      this.listeners.forEach(cb => cb(user))
    })
  }

  subscribe(cb: (user: AuthUser | null) => void) {
    this.listeners.push(cb)
    cb(this.user)
    return () => {
      this.listeners = this.listeners.filter(x => x !== cb)
    }
  }

  login() {
    return authRepository.login()
  }

  logout() {
    return authRepository.logout()
  }
}

export const authStore = new AuthStore()