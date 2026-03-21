import { localStorageProvider }  from './local'
import { sftpStorageProvider }   from './sftp'
import { minioStorageProvider }  from './minio'
import type { StorageProvider }  from './index'

const providers: Record<string, StorageProvider> = {
  local: localStorageProvider,
  sftp:  sftpStorageProvider,
  minio: minioStorageProvider,
}

const selected = process.env.STORAGE_PROVIDER ?? 'local'

if (!providers[selected]) {
  throw new Error(`Unknown storage provider: "${selected}". Valid options: local, sftp, minio`)
}

export const storage: StorageProvider = providers[selected]