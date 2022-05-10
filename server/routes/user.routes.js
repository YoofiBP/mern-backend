const userRouter = require('express').Router();

import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller';
import multer from 'multer';

const upload = multer();

userRouter.route('/api/users')
    .get(authController.requireSignIn, userController.index)
    .post(userController.store)

userRouter.route('/api/users/:userId')
    .get(authController.requireSignIn, userController.show)
    .put(authController.requireSignIn, authController.hasAuthorization, upload.single('picture'), userController.update)
    .delete(authController.requireSignIn, authController.hasAuthorization, userController.remove)

userRouter.param('userId', userController.userById);

export default userRouter;