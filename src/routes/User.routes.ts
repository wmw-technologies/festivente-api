import { Router } from 'express';
import UserController from '../controllers/User.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import Permissions from '../permissions';

const router = Router();

router.get('/me', authentication, UserController.me);
router.get('/list', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), UserController.list);
router.post('/create', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), UserController.create);

export default router;
