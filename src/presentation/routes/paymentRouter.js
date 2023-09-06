import { Router } from 'express';
/* Controller */
import { createOrder, receiveWebhook, captureOrder } from '../controllers/paymentController.js';
/* Middlewares */
import { choosePayment } from '../middlewares/choosePayment.js';
import { isPermissions } from '../middlewares/isPermissions.js';
import { verifyToken } from '../middlewares/authJwt.js';

const paymentRouter = Router();


paymentRouter.post('/create-order', [verifyToken, isPermissions('payments', 'createOrder'), choosePayment], createOrder);

paymentRouter.get('/capture-order', captureOrder);

paymentRouter.post('/webhook', receiveWebhook);


export default paymentRouter;
