import { Router } from 'express';
import CarsController from '../Cars.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Cars.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.SERVICE.ACCESS), CarsController.list);
router.post('/create', authentication, authorization(Permissions.SERVICE.ACCESS), validate(zodSchema), CarsController.create);
router.put('/update/:id', authentication, authorization(Permissions.SERVICE.ACCESS), validate(zodSchema), CarsController.update);
router.get('/:id', authentication, authorization(Permissions.SERVICE.ACCESS), CarsController.get);

export default router;