import { Router } from 'express';
import UserController from '../controllers/User.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import Permissions from '../permissions';

const router = Router();

router.get('/me', authentication, UserController.me);
router.get('/list', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), UserController.list);
router.post('/create', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), UserController.create);
router.put('/update/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), UserController.update);
router.get('/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), UserController.get);

export default router;
