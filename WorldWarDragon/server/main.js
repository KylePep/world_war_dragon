import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import { DbConnection } from './db/DbConfig.js';
import { Startup } from './Startup.js';
import { logger } from './utils/Logger.js';

// ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// ---- STATIC FRONTEND (after API routes) ----
const clientDistPath = path.resolve(__dirname, '../../WorldWarDragon.client/dist');
app.use(express.static(clientDistPath));

// TLS dev flag
if (process.env.NODE_ENV === 'dev') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
}

// HTTP Server
const httpServer = createServer(app);
// ---- GLOBAL MIDDLEWARE & API ROUTES FIRST ----
Startup.ConfigureGlobalMiddleware(app);
Startup.ConfigureRoutes(app);

// Connect to MongoDB
DbConnection.connect().catch(err => console.error(err));

// Start
httpServer.listen(port, () => {
  logger.log(`[SERVING ON PORT: ${port}]`);
});
