import { Router } from 'express';
import UserController from '../controllers/User.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';

const router = Router();

router.get('/me', authentication, UserController.me);
router.post('/create', authentication, UserController.create);
router.get('/list', authentication, authorization('read'), UserController.list);

export default router;
