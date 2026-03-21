import express from 'express'
import cors from 'cors'
import path from 'path'
import multer from 'multer'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth'
import { appRouter } from './routers'
import { storage } from './storage/provider'
import { prisma } from '@av-portal/db'
import { fileUploadedEmail } from './email/templates'
import { sendEmail } from './email/send'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

app.use(express.json())

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Auth routes
app.all('/api/auth/*splat', toNodeHandler(auth))

// tRPC routes
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
}))

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(3001, () => {
  console.log('API running on http://localhost:3001')
})

// File upload endpoint
app.post('/api/upload/:projectId', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' })
      return
    }

    const projectId = req.params.projectId as string
    const timestamp = Date.now()
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const filename = `${projectId}_${timestamp}_${safeName}`

    await storage.save(req.file.buffer, filename, req.file.mimetype)

    const file = await prisma.file.create({
      data: {
        projectId,
        name:       req.file.originalname,
        url:        storage.getUrl(filename),
        uploadedBy: 'client',
      },
    })

    // Notify admin
    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (project) {
      const template = fileUploadedEmail({
        adminName:    'Admin',
        clientName:   'Client',
        eventName:    project.name,
        fileName:     req.file.originalname,
        dashboardUrl: `${process.env.PORTAL_URL ?? 'http://localhost:3000'}/events/${projectId}/files`,
      })
      await sendEmail({
        to:      process.env.ADMIN_EMAIL ?? 'admin@nexusav.com',
        subject: template.subject,
        html:    template.html,
      })
    }

    res.json(file)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
})