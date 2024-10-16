import { Router } from 'express';
import UserController from '../controllers/User.controller';

const router = Router();

router.get('/me', UserController.me);

export default router;
