import * as dotenv from 'dotenv';
import { ServerApiVersion } from 'mongodb';
import * as mongoose from 'mongoose';
import { logger } from './logger';
dotenv.config({ path: __dirname + '/../../.env' });

const mongoURL: String | undefined = process.env.MONGO_URL;

/**
 * @description - Connects to Mongodb Cluster
 * @constructor
 * @returns {Promise<void>} - Promise
 */

export const connectToDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(`${mongoURL}`, <mongoose.ConnectOptions>{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  } catch (error: any) {
    logger.error({ message: `Mongo client: Unexpected error on idle client`, extra: error });
    process.exit(1);
  }
};
