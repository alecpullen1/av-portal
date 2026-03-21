export interface StorageProvider {
  save(file: Buffer, filename: string, mimeType: string): Promise<string>
  delete(url: string): Promise<void>
  getUrl(filename: string): string
}