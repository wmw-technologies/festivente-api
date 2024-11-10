import { Router } from 'express';
import RentalController from '../controllers/Rental.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.list);
router.post('/create', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.create);
router.put('/update/:id', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.update);
router.get('/available-devices', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.availableDevices);
router.get('/:id', authentication, authorization(Permissions.RENTALS.ACCESS), RentalController.get);

export default router;
