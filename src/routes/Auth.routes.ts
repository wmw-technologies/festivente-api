import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/User.model';

const router = Router();

router.post('/sign-in', validate(zodSchema), AuthController.signIn);

export default router;
