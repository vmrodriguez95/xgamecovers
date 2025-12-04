import { storageService } from '../../firebase/storage.service'

export const storageRepository = {
  uploadImage: async (file: File, path: string) => {
    return await storageService.uploadImage(file, path)
  },
  getImageUrl: async (path: string) => {
    return await storageService.getImageUrl(path)
  },
  deleteImage: async (path: string) => {
    return await storageService.deleteImage(path)
  }
}