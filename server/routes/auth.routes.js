import authController from '../controllers/auth.controller';

const authRouter = require('express').Router();

authRouter.post('/auth/signin', authController.signIn);

authRouter.get('/auth/signout', authController.signOut)

export default authRouter;