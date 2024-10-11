import { Router } from 'express';
import * as controller from '../controllers/Auth.controller';

const router = Router();

router.post('/sign-in', controller.signIn);

export default router;
