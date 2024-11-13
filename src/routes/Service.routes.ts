import { Router } from 'express';
import ServiceController from '../controllers/Service.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import Permissions from '../permissions';

const router = Router();

router.get('/list',/* authentication, authorization(Permissions.ADMINISTRATION.ACCESS), */ ServiceController.list);
router.post('/create', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), ServiceController.create);
router.put('/update/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), ServiceController.update);
router.get('/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), ServiceController.get);

export default router;
