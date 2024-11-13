import { Router } from 'express';
import ServiceController from '../controllers/Service.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Service.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.SERVICE.ACCESS), ServiceController.list);
router.post('/create', authentication, authorization(Permissions.SERVICE.ACCESS), validate(zodSchema), ServiceController.create);
router.put('/update/:id', authentication, authorization(Permissions.SERVICE.ACCESS), validate(zodSchema), ServiceController.update);
router.get('/:id', authentication, authorization(Permissions.SERVICE.ACCESS), ServiceController.get);

export default router;
