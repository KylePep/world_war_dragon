import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http'
import { DbConnection } from './db/DbConfig.js'
// import { socketProvider } from './SocketProvider.js'
import { Startup } from './Startup.js'
import { logger } from './utils/Logger.js'


// create server & socketServer
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(process.cwd(), 'WorldWarDragon/server/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'WorldWarDragon/server/public/index.html'));
});

if (process.env.NODE_ENV == 'dev') {
  // @ts-ignore
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

const httpServer = createServer(app)
Startup.ConfigureGlobalMiddleware(app)
Startup.ConfigureRoutes(app)

// Establish Socket
// socketProvider.initialize(httpServer)

// Connect to Atlas MongoDB
DbConnection.connect().catch(err => {
  console.error(err)
})


// Start Server
httpServer.listen(port, () => {
  logger.log(`[SERVING ON PORT: ${port}]`)
})
