import express from 'express';


import registerController from '../controllers/register.js';
import registerMiddleware from '../middlewares/register.js';


import loginController from '../controllers/login.js';
import loginMiddleware from '../middlewares/login.js';

const router = express.Router();

router.post('/register', registerMiddleware, registerController);
router.post('/login', loginMiddleware, loginController);

export default router;