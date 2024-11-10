import { Router } from 'express';
import EventController from '../controllers/Event.controller';
import { authentication, authorization } from '../middlewares/Auth.middleware';
import { validate } from '../middlewares/Validation.middleware';
import { zodSchema } from '../models/Event.model';
import Permissions from '../permissions';

const router = Router();

router.get('/list', authentication, authorization(Permissions.EVENTS.ACCESS), EventController.list);
router.post('/create', authentication, authorization(Permissions.EVENTS.ACCESS), validate(zodSchema), EventController.create);
router.put('/update/:id', authentication, authorization(Permissions.EVENTS.ACCESS), validate(zodSchema), EventController.update);
router.get('/:id', authentication, authorization(Permissions.EVENTS.ACCESS), EventController.get);

export default router;
