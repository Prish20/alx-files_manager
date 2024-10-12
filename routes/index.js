import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

/** Create a new Express router */
const router = Router();

/** Define routes for status and stats */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

/** Define route for creating new users */
router.post('/users', UsersController.postNew);

/** Define new routes for auth and user me */
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

/** Export the router for use in the main app */
export default router;
