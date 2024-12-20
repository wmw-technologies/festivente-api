import { Router } from 'express';
import RentalController from '../controllers/Rental.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import Permissions from '../permissions';
import { zodSchema } from '../models/Rental.model';

const router = Router();

router.get('/list', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.list);
router.post('/create', authentication, authorization(Permissions.RENTALS.ACCESS), validate(zodSchema), RentalController.create);
router.put('/update/:id', authentication, authorization(Permissions.RENTALS.ACCESS), validate(zodSchema), RentalController.update);
router.get('/available-devices', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.availableDevices);
router.patch('/change-status-to-paid/:id', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.changeStatusToPaid);
router.get('/:id', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.get);

export default router;
