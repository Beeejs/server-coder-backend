import express from 'express';
/* Dotenv */
/* import dotenv from 'dotenv';
dotenv.config(); */
/* Morgan */
import morgan from 'morgan';
/* Cookie Parser */
import cookieParser from 'cookie-parser';
/* Helmet */
import helmet from 'helmet';
/* Cors */
import cors from 'cors';
/* ErrorHandler */
import errorHandler from '../middlewares/errorHanlder.js';
/* Swagger */
import { specs } from '../../utils/swaggerConfig.js';
import swaggerUiExpress from 'swagger-ui-express';
/* Logger */
import { Logger } from '../../utils/logger.js';
/* Config */
import { FRONT } from '../../config/index.js';

// Routes
import productRouter from '../routes/productRouter.js';
import cartRouter from '../routes/cartRouter.js';
import userRouter from '../routes/userRouter.js';
import sessionRouter from '../routes/sessionRouter.js';
import roleRouter from '../routes/roleRouter.js';
import ticketRouter from '../routes/ticketRouter.js';
import paymentRouter from '../routes/paymentRouter.js';
import emailRouter from '../routes/emailRouter.js';

class AppExpress
{
  init()
  {
    this.app = express();
    this.app.use(morgan('dev'));
    this.app.use(cors(
      {
        origin: FRONT,
        credentials: true
      }
    ));
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  build()
  {
    this.app.use('/api/products', productRouter);
    this.app.use('/api/carts', cartRouter);
    this.app.use('/api/users', userRouter);
    this.app.use('/api/roles', roleRouter);
    this.app.use('/api/sessions', sessionRouter);
    this.app.use('/api/tickets', ticketRouter);
    this.app.use('/api/payments', paymentRouter);
    this.app.use('/api/emails', emailRouter);
    this.app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
    this.app.use(errorHandler);
  }

  callback()
  {
    return this.app;
  }

  close()
  {
    this.server.close();
  }

  listen()
  {
    this.server = this.app.listen(process.env.PORT, () =>
      {
        Logger.info(`Server listen on port ${process.env.PORT}`);
      }
    );

    return this.server;
  }
}

export default AppExpress;
