import fs from 'fs'
import path from 'path'
import type { StorageProvider } from './index'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

// Make sure the uploads folder exists on startup
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export const localStorageProvider: StorageProvider = {
  async save(file, filename) {
    const filePath = path.join(UPLOAD_DIR, filename)
    fs.writeFileSync(filePath, file)
    return filename
  },

  async delete(filename) {
    const filePath = path.join(UPLOAD_DIR, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  },

  getUrl(filename) {
    return `/uploads/${filename}`
  },
}