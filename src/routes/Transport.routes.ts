import { Router } from 'express';
import TransportController from '../controllers/Transport.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Transport.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.TRANSPORT.ACCESS), TransportController.list);
router.post('/create', authentication, authorization(Permissions.EVENTS.ACCESS), validate(zodSchema), TransportController.create);
router.put('/update/:id', authentication, authorization(Permissions.EVENTS.ACCESS), validate(zodSchema), TransportController.update);
router.get('/:id', authentication, authorization(Permissions.EVENTS.ACCESS), TransportController.get);

export default router;
