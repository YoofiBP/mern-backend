import postController from '../controllers/post.controller';

const postRouter = require('express').Router();

postRouter.route('/api/posts')
    .post(postController.store)
    .get(postController.list)

export default postRouter;