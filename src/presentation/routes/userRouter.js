import { Router } from 'express';
/* Middlewares */
import { verifyToken } from '../middlewares/authJwt.js';
import { isPermissions } from '../middlewares/isPermissions.js';
/* Controller */
import { deleteOne, getOne, list, create, update } from '../controllers/userController.js';


const userRouter = Router();


userRouter.get('/', [verifyToken, isPermissions('users', 'getList')], list);

userRouter.get('/:uId', [verifyToken, isPermissions('users', 'getOne')], getOne);

userRouter.post('/', [verifyToken, isPermissions('users', 'create')], create);

userRouter.put('/:uId', [verifyToken, isPermissions('users', 'update')], update);

userRouter.delete('/:uId', [verifyToken, isPermissions('users', 'delete')], deleteOne);


export default userRouter;
