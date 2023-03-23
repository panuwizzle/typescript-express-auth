import app from './app';
import https from 'https'
import { readFileSync } from 'fs';
import connectDB from './utils/database'
import { logger } from './utils/logs'


let httpsOptions = {
  key: readFileSync(__dirname + '/certs/localhost-key.pem', 'utf8'),
  cert: readFileSync(__dirname + '/certs/localhost.pem', 'utf8'),
}

const startServer = async () => {
  const port = process.env.PORT || 3000;
  await connectDB()
  https.createServer(httpsOptions, app).listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });
};

startServer();
