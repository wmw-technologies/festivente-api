import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';

const router = Router();

router.post('/sign-in', AuthController.signIn);

export default router;
