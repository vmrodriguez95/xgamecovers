import type { AuthUser } from './auth.types'
import { authRepository } from './auth.repository'

class AuthStore {
  user: AuthUser | null = null

  constructor() {
    authRepository.onAuthChange((user) => {
      this.user = user
    })
  }

  login() {
    return authRepository.login()
  }

  logout() {
    return authRepository.logout()
  }

  isLogged() {
    return !!this.user
  }
}

export const authStore = new AuthStore()