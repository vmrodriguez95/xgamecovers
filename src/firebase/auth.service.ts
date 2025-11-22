import {
  User,
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './index'

const provider = new GoogleAuthProvider()

export function loginWithGoogle(): Promise<User> {
  return signInWithPopup(auth, provider).then(result => result.user)
}

export function logout(): Promise<void> {
  return signOut(auth)
}

export function listenAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}