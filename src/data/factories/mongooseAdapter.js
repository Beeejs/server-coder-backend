/* Mongoose */
import mongoose from 'mongoose';
/* Logger */
import { Logger } from '../../utils/logger.js';

class MongooseAdapter
{
  constructor()
  {
    this.connection = mongoose.connection;
  }
  async init(uri)
  {
    try
    {
      await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
      Logger.info('Connected to Database.');
    }
    catch (e)
    {
      Logger.error(`Error connected to Database: ${e}`);
    }
  }

  async close()
  {
    try
    {
      await mongoose.connection.close();
      Logger.info('Database closed.');
    }
    catch (e)
    {
      Logger.error(`Error closing Database: ${e}`);
    }
  }

  async drop()
  {
    try
    {
      await mongoose.connection.dropDatabase();
      Logger.info('Database dropped.');
    }
    catch (e)
    {
      Logger.error(`Error dropping Database: ${e}`);
    }
  }
}

export default MongooseAdapter;
