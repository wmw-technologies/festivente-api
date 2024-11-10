import { Router } from 'express';
import EventController from '../controllers/Event.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Event.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.WAREHOUSE.ACCESS), EventController.list);
// router.post('/create', authentication, authorization(Permissions.WAREHOUSE.ACCESS), validate(zodSchema), WarehouseController.create);
// router.put('/update/:id', authentication, authorization(Permissions.WAREHOUSE.ACCESS), validate(zodSchema), WarehouseController.update);
// router.get('/:id', authentication, authorization(Permissions.WAREHOUSE.ACCESS), WarehouseController.get);

export default router;
