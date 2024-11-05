import { Router } from 'express';
import EmployeesController from '../controllers/Employees.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Employee.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.EMPLOYEES.ACCESS), EmployeesController.list);
router.post('/create', authentication, authorization(Permissions.EMPLOYEES.ACCESS), validate(zodSchema), EmployeesController.create);
router.put('/update/:id', authentication, authorization(Permissions.EMPLOYEES.ACCESS), validate(zodSchema), EmployeesController.update);
router.get('/:id', authentication, authorization(Permissions.EMPLOYEES.ACCESS), EmployeesController.get);

export default router;
