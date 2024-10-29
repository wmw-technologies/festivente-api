import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';
import { validate } from '../middlewares/Validation.middleware';
import { signInSchema } from '../models/User.model';

const router = Router();

router.post('/sign-in', validate(signInSchema), AuthController.signIn);

export default router;
