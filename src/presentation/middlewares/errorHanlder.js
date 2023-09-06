/* Logger */
import { Logger } from '../../utils/logger.js';

const errorHandler = (err, req, res, next) =>
{
  switch (err.name)
  {
    case 'MongoServerError':
      Logger.info('----- Server Error -----');
      Logger.error(`Message: ${err.message}`);
      res.status(400).send({ status: 'error', error: err.message });
    break;

    case 'ZodError':
      Logger.info('----- Zod Error -----');
      Logger.error(err.issues);
      res.status(400).send({ status: 'error', error: err.issues });
    break;

    case 'TokenExpiredError':
      Logger.info('----- JWT Error -----');
      Logger.error(`Message: ${err.message}`);
      res.status(400).send({ status: 'error', error: err.message });
    break;

    default:
      Logger.info(`--- ${err.name} ---`);
      Logger.error(`Message: ${err.message}`);
      res.status(500).send({ status: 'error', message: err.message });
    break;
  }
};

export default errorHandler;
