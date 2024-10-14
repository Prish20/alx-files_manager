import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

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

/** Define route for uploading files */
router.post('/files', FilesController.postUpload);

/** Define new routes for getting and listing files */
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

/** Define new routes for publishing and unpublishing files */
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

/** Define new route for getting file data */
router.get('/files/:id/data', FilesController.getFile);

/** Export the router for use in the main app */
export default router;
