'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { trpc } from '@/lib/trpc'

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4',
  'image/png',
  'image/jpeg',
]

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':  return '📄'
    case 'pptx':
    case 'ppt':  return '📊'
    case 'mp4':  return '🎬'
    case 'png':
    case 'jpg':
    case 'jpeg': return '🖼'
    default:     return '📁'
  }
}

export default function FilesPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const { data: files, isLoading, refetch } = trpc.files.forProject.useQuery({ projectId })
  const deleteFile = trpc.files.delete.useMutation({ onSuccess: () => refetch() })

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF, PPTX, MP4, PNG, or JPG.')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('File is too large. Maximum size is 100MB.')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/upload/${projectId}`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      await refetch()
    } catch (err) {
      setError('Upload failed — please try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm font-medium text-gray-900">File Hub</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">File Hub</h1>
        <p className="text-sm text-gray-400 mb-8">
          Upload your presentation decks, logos, and videos for your event.
        </p>

        {/* Upload area */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-amber-300 hover:bg-amber-50 transition-colors mb-6"
        >
          <p className="text-2xl mb-2">📂</p>
          <p className="text-sm font-medium text-gray-700">
            {uploading ? 'Uploading...' : 'Click to upload a file'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, PPTX, MP4, PNG, JPG — max 100MB
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.pptx,.ppt,.mp4,.png,.jpg,.jpeg"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {/* File list */}
        {isLoading ? (
          <p className="text-sm text-gray-400">Loading files...</p>
        ) : files && files.length > 0 ? (
          <div className="space-y-2">
            {files.map(file => (
              <div
                key={file.id}
                className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{fileIcon(file.name)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Uploaded {new Date(file.createdAt).toLocaleDateString('en-AU', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                        View
                    </a>
                  <button
                    onClick={() => deleteFile.mutate({ id: file.id })}
                    className="text-xs text-gray-300 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">
            No files uploaded yet
          </p>
        )}
      </main>
    </div>
  )
}