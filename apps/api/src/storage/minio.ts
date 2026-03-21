import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import type { StorageProvider } from './index'

const client = new S3Client({
  endpoint:         process.env.MINIO_ENDPOINT,  // e.g. http://192.168.1.50:9000
  region:           process.env.MINIO_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId:     process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,  // Required for MinIO
})

const bucket = process.env.MINIO_BUCKET ?? 'av-portal'
const baseUrl = process.env.MINIO_BASE_URL!  // e.g. http://192.168.1.50:9000/av-portal

export const minioStorageProvider: StorageProvider = {
  async save(file, filename, mimeType) {
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key:    filename,
      Body:   file,
      ContentType: mimeType,
    }))
    return filename
  },

  async delete(filename) {
    await client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key:    filename,
    }))
  },

  getUrl(filename) {
    return `${baseUrl}/${filename}`
  },
}