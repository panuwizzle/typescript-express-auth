import app from './app';
import connectDB from './utils/database'
import { logger } from './utils/logs'

const startServer = async () => {
  const port = process.env.PORT || 3000;
  await connectDB()
  app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });
};

startServer();

/*
connectDB().then(() => {
  startServer();
})
*/
