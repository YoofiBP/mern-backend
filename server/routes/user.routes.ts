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

userRouter.get('/api/users/photo/:userId', authController.requireSignIn, userController.userPhoto)

userRouter.post('/api/users/follow', userController.addFollowing, userController.addFollowed)

userRouter.param('userId', userController.userById);

export default userRouter;