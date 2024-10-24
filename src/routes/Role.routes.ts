import { Router } from 'express';
import RoleController from '../controllers/Role.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';

const router = Router();

router.post('/create', authentication, RoleController.create);
router.get('/list', authentication, authorization('read'), RoleController.list);

export default router;
