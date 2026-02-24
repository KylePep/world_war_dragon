import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'
import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http'
import { DbConnection } from './db/DbConfig.js'
import { Startup } from './Startup.js'
import { logger } from './utils/Logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// create server & socketServer
const app = express()
const port = process.env.PORT || 3000

const clientDistPath = path.join(__dirname, '../client')

app.use(express.static(clientDistPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'))
})

if (process.env.NODE_ENV == 'dev') {
  // @ts-ignore
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
}

const httpServer = createServer(app)
Startup.ConfigureGlobalMiddleware(app)
Startup.ConfigureRoutes(app)

// Connect to Atlas MongoDB
DbConnection.connect().catch(err => {
  console.error(err)
})


// Start Server
httpServer.listen(port, () => {
  logger.log(`[SERVING ON PORT: ${port}]`)
})
