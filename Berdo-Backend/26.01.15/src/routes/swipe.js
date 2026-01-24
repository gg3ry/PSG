import express from 'express';
import { getSwipeController, postSwipeController } from '../controllers/swipe.js';
import jwtVerifyMiddleware from '../middlewares/jwtverify.js';
import setSearchMiddleware from '../middlewares/setsearch.js';
import setSearchController from '../controllers/setsearch.js';

const router = express.Router();

router.get('/swipe', jwtVerifyMiddleware, getSwipeController);
router.post('/swipe', jwtVerifyMiddleware, postSwipeController);
router.post('/setsearch', jwtVerifyMiddleware, setSearchMiddleware, setSearchController);
export default router;