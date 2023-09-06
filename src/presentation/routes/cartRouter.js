import { Router } from 'express';
/* Controller */
import { create, getOne, addProduct, cleanProducts, deleteProduct, deleteAllProduct, purchase, getOneByUser } from '../controllers/cartController.js';
/* Middleawares */
import { verifyToken } from '../middlewares/authJwt.js';
import { isPermissions } from '../middlewares/isPermissions.js';

const cartRouter = Router();
// MODIFICAR LA DOCU CON EL ADD Y EL DELETE Y EL deleteAllProduct

cartRouter.get('/:cId', [verifyToken, isPermissions('carts', 'getOne')], getOne);

cartRouter.get('/user/:uId', [verifyToken, isPermissions('carts', 'getOneByUser')], getOneByUser);

cartRouter.get('/:cId/purchase', verifyToken, purchase);

cartRouter.post('/', create); // Quitar el verifyToken y isPermissions para el front. Enlazar al usuario con su carrito en el registro.

cartRouter.put('/:cId/addproduct/:pId', [verifyToken, isPermissions('carts', 'addProduct')], addProduct);

cartRouter.put('/:cId', [verifyToken, isPermissions('carts', 'cleanProducts')], cleanProducts);

cartRouter.put('/:cId/deleteproduct/:pId', [verifyToken, isPermissions('carts', 'deleteProduct')], deleteProduct);

cartRouter.delete('/:cId/products/:pId', [verifyToken, isPermissions('carts', 'deleteAllProduct')], deleteAllProduct);


export default cartRouter;
