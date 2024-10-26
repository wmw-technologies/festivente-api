import { Router } from 'express';
import RoleController from '../controllers/Role.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), RoleController.list);
router.post('/create', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), RoleController.create);
router.put('/update/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), RoleController.update);
router.get('/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), RoleController.get);

export default router;
