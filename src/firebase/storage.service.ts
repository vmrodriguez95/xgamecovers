import { storage } from './index'
import {
  ref,
  listAll,
  uploadBytes,
  deleteObject,
  getDownloadURL
} from 'firebase/storage'

class StorageService {
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

  async deleteFolder(path: string): Promise<void> {
    const folderRef = ref(storage, path)

    const list = await listAll(folderRef)

    for (const item of list.items) {
      await deleteObject(item)
    }
  }
}

export const storageService = new StorageService()
