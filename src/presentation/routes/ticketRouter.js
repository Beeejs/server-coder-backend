import { Router } from 'express';
/* Controller */
import { deleteOne, getOne, getOneByPaymentId, list, create, update } from '../controllers/ticketController.js';
/* Middlewares */
import { verifyToken } from '../middlewares/authJwt.js';
import { isPermissions } from '../middlewares/isPermissions.js';

const ticketRouter = Router();


ticketRouter.get('/', [verifyToken, isPermissions('tickets', 'getList')], list);

ticketRouter.get('/:tId', [verifyToken, isPermissions('tickets', 'getOne')], getOne);

ticketRouter.get('/payment/:pId', [verifyToken, isPermissions('tickets', 'getOneByPaymentId')], getOneByPaymentId);

ticketRouter.post('/', [verifyToken, isPermissions('tickets', 'create')], create);

ticketRouter.put('/:tId', [verifyToken, isPermissions('tickets', 'update')], update);

ticketRouter.delete('/:tId', [verifyToken, isPermissions('tickets', 'delete')], deleteOne);


export default ticketRouter;
