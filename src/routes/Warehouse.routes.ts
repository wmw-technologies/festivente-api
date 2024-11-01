import { Router } from 'express';
import WarehouseItemController from '../controllers/Warehouse.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseItemController.list);
router.post('/create', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseItemController.create);
router.get('/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseItemController.get);
router.put('/update/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseItemController.update);
//router.delete('/delete/:id', authentication, authorization(Permissions.ADMINISTRATION.ACCESS), WarehouseItemController.delete);

export default router;