import { User } from 'firebase/auth'
import { AuthUser } from './auth.types'
import { AuthFactory } from './auth.factory'
import { authService } from '../../firebase/auth.service'

class AuthRepository {
  getCurrentUser(): AuthUser | null {
    return AuthFactory.fromApi(authService.getCurrentUser())
  }

  async login(): Promise<AuthUser> {
    return await authService.loginWithGoogle().then((user) => {
      const mapped = AuthFactory.fromApi(user)

      if (!mapped) {
        throw new Error('Login failed: no user returned')
      }

      return mapped
    })
  }

  async logout(): Promise<void> {
    return await authService.logout()
  }

  onAuthChange(callback: (user: AuthUser | null) => void) {
    return authService.listenAuthChanges((user) => callback(AuthFactory.fromApi(user)))
  }
}

export const authRepository = new AuthRepository()
