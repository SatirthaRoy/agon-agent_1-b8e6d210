import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function readJsonBody(req: any): Promise<any> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })

    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8').trim()
      if (!raw) return resolve(undefined)

      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve(raw)
      }
    })

    req.on('error', reject)
  })
}

function createApiResponse(res: any) {
  const wrapped = {
    setHeader: (...args: any[]) => res.setHeader(...args),
    getHeader: (...args: any[]) => res.getHeader(...args),
    removeHeader: (...args: any[]) => res.removeHeader(...args),
    writeHead: (...args: any[]) => res.writeHead(...args),
    status(code: number) {
      res.statusCode = code
      return wrapped
    },
    json(payload: any) {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json')
      }
      res.end(JSON.stringify(payload))
      return wrapped
    },
    send(payload: any) {
      if (!res.headersSent) {
        res.setHeader('Content-Type', typeof payload === 'string' ? 'text/plain; charset=utf-8' : 'application/json')
      }
      res.end(typeof payload === 'string' ? payload : JSON.stringify(payload))
      return wrapped
    },
    end(payload?: any) {
      res.end(payload)
      return wrapped
    },
  }
  return wrapped
}

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next()
        }

        const url = new URL(req.url, 'http://localhost')
        const routeName = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '')
        const apiFile = path.join(__dirname, 'api', `${routeName}.js`)

        try {
          await fs.access(apiFile)
        } catch {
          return createApiResponse(res).status(404).json({ error: 'API route not found' })
        }

        let body
        if (req.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
          body = await readJsonBody(req)
        }

        try {
          const moduleUrl = pathToFileURL(apiFile).href
          const mod = await import(`${moduleUrl}?t=${Date.now()}`)
          const handler = mod.default || mod

          const reqWithBody = {
            ...req,
            method: req.method || 'GET',
            url: req.url,
            query: Object.fromEntries(url.searchParams.entries()),
            body,
          }

          await handler(reqWithBody, createApiResponse(res))
        } catch (error) {
          console.error('API dev middleware error:', error)
          if (!res.headersSent) {
            createApiResponse(res).status(500).json({
              error: error instanceof Error ? error.message : 'Internal server error',
            })
          }
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_'])

  for (const [key, value] of Object.entries(env)) {
    if (value && !process.env[key]) {
      process.env[key] = value
    }
  }

  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  }
})
