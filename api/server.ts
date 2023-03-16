import app from './app';
import connectDB from './utils/database'

const startServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

connectDB().then(() => {
  startServer();
})
