import { Router } from 'express';
import RentalsController from '../controllers/Rentals.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import Permissions from '../permissions';

const router = Router();

router.get('/list', /*authentication, authorization(Permissions.RENTALS.ACCESS),*/RentalsController.list);
router.get('/:id',  authentication, authorization(Permissions.RENTALS.ACCESS),RentalsController.get);
router.post('/create', authentication, authorization(Permissions.RENTALS.ACCESS), RentalsController.create);
router.put('/update/:id', authentication, authorization(Permissions.RENTALS.ACCESS), RentalsController.update);

export default router;