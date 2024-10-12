import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

/** Create a new Express router */
const router = Router();

/** Define routes for status and stats */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

/** Define route for creating new users */
router.post('/users', UsersController.postNew);

/** Export the router for use in the main app */
export default router;
