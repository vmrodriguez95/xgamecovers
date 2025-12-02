import { storage } from './index'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

export class StorageService {
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  }

  async getImageUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
  }

  async deleteImage(path: string): Promise<void> {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  }
}

export const storageService = new StorageService()
