import { storageService } from '../../firebase/storage.service'

class StorageRepository {
  async uploadImage(file: File, path: string) {
    return await storageService.uploadImage(file, path)
  }

  async getImageUrl(path: string) {
    return await storageService.getImageUrl(path)
  }

  async deleteImage(path: string) {
    return await storageService.deleteImage(path)
  }

  async deleteFolder(path: string) {
    return await storageService.deleteFolder(path)
  }
}

export const storageRepository = new StorageRepository()