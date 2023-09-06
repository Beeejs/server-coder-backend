import { Router } from 'express';
/* Controller */
import { deleteOne, getOne, list, create, update } from '../controllers/roleController.js';
/* Middlewares */
import { verifyToken } from '../middlewares/authJwt.js';
import { isPermissions } from '../middlewares/isPermissions.js';

const roleRouter = Router();


roleRouter.get('/', [verifyToken, isPermissions('roles', 'getList')], list);

roleRouter.get('/:rId', [verifyToken, isPermissions('roles', 'getOne')], getOne);

roleRouter.post('/', [verifyToken, isPermissions('roles', 'create')], create);

roleRouter.put('/:rId', [verifyToken, isPermissions('roles', 'update')], update);

roleRouter.delete('/:rId', [verifyToken, isPermissions('roles', 'delete')], deleteOne);


export default roleRouter;
