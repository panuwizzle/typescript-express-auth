import mongoose from 'mongoose';
import { logger } from '../utils/logs'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mydatabase');
    logger.info('MongoDB connected');
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};

export default connectDB;