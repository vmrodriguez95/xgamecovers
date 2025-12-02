import { auth } from './index'
import {
  User,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth'

class AuthService {
  provider = new GoogleAuthProvider()

  loginWithGoogle(): Promise<User> {
    return signInWithPopup(auth, this.provider).then(result => result.user)
  }

  logout(): Promise<void> {
    return signOut(auth)
  }

  listenAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  getCurrentUser(): User | null {
    return auth.currentUser
  }
}

export const authService = new AuthService()


