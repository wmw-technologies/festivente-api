import { Router } from 'express';
import WarehouseController from '../controllers/Warehouse.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Warehouse.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseController.list);
router.post('/create', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), validate(zodSchema), WarehouseController.create);
router.put('/update/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), validate(zodSchema), WarehouseController.update);
router.get('/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseController.get);
//router.delete('/delete/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseItemController.delete);

export default router;
