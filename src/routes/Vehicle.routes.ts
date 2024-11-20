import { Router } from 'express';
import VehicleController from '../controllers/Vehicle.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Vehicle.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.VEHICLES.ACCESS), VehicleController.list);
router.post('/create', authentication, authorization(Permissions.VEHICLES.ACCESS), validate(zodSchema), VehicleController.create);
router.put('/update/:id', authentication, authorization(Permissions.VEHICLES.ACCESS), validate(zodSchema), VehicleController.update);
router.get('/:id', authentication, authorization(Permissions.VEHICLES.ACCESS), VehicleController.get);

export default router;
