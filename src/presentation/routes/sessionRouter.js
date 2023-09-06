import { Router } from 'express';
/* Controller */
import { login, register, current, forgotPassword, resetPassword, logout, refreshToken } from '../controllers/sessionController.js';
/* Middlewares */
import { verifyToken } from '../middlewares/authJwt.js';

const sessionRouter = Router();


sessionRouter.post('/login', login);

sessionRouter.post('/current', verifyToken, current);

sessionRouter.post('/signup', register);

sessionRouter.get('/logout/:token', logout);

sessionRouter.post('/forgotpassword', forgotPassword);

sessionRouter.post('/resetpassword/:token', resetPassword);

sessionRouter.get('/refreshtoken', refreshToken);


export default sessionRouter;
