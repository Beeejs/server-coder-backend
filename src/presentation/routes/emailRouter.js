import { Router } from 'express';
import { sendEmail } from '../controllers/emailController.js';


const emailRouter = Router();

emailRouter.post('/', sendEmail);

export default emailRouter;
