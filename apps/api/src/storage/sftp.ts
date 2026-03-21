import { Client } from 'ssh2'
import type { StorageProvider } from './index'

const config = {
  host:     process.env.SFTP_HOST!,
  port:     parseInt(process.env.SFTP_PORT ?? '22'),
  username: process.env.SFTP_USER!,
  password: process.env.SFTP_PASSWORD,
  // Or use a private key instead of password:
  // privateKey: fs.readFileSync(process.env.SFTP_KEY_PATH!)
  basePath: process.env.SFTP_BASE_PATH ?? '/uploads',
  baseUrl:  process.env.SFTP_BASE_URL!,
}

function withSftp<T>(fn: (sftp: any) => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) { conn.end(); return reject(err) }
        fn(sftp)
          .then(result => { conn.end(); resolve(result) })
          .catch(err  => { conn.end(); reject(err) })
      })
    })
    conn.on('error', reject)
    conn.connect(config)
  })
}

export const sftpStorageProvider: StorageProvider = {
  async save(file, filename) {
    await withSftp(sftp => new Promise<void>((resolve, reject) => {
      const remotePath = `${config.basePath}/${filename}`
      const writeStream = sftp.createWriteStream(remotePath)
      writeStream.on('close', resolve)
      writeStream.on('error', reject)
      writeStream.end(file)
    }))
    return filename
  },

  async delete(filename) {
    await withSftp(sftp => new Promise<void>((resolve, reject) => {
      sftp.unlink(`${config.basePath}/${filename}`, (err: any) => {
        if (err) reject(err)
        else resolve()
      })
    }))
  },

  getUrl(filename) {
    return `${config.baseUrl}/${filename}`
  },
}