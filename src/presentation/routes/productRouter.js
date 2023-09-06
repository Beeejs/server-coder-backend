import { Router } from 'express';
/* Controller */
import { deleteOne, getOne, list, create, update } from '../controllers/productController.js';
/* Middlewares */
import { verifyToken } from '../middlewares/authJwt.js';
import { isPermissions } from '../middlewares/isPermissions.js';

const productRouter = Router();


productRouter.get('/', [verifyToken, isPermissions('products', 'getList')], list);

productRouter.get('/:pId', [verifyToken, isPermissions('products', 'getOne')], getOne);

productRouter.post('/', [verifyToken, isPermissions('products', 'create')], create);

productRouter.put('/:pId', [verifyToken, isPermissions('products', 'update')], update);

productRouter.delete('/:pId', [verifyToken, isPermissions('products', 'delete')], deleteOne);


export default productRouter;
