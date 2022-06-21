import postController from '../controllers/post.controller';
import userController from '../controllers/user.controller';

const postRouter = require('express').Router();

postRouter.route('/api/posts')
    .post(postController.store)

postRouter.route('/api/posts/like')
    .put(postController.likePost)

postRouter.route('/api/posts/unlike')
    .put(postController.unLikePost)

postRouter.route('/api/posts/comment')
    .post(postController.commentOnPost)
    .delete(postController.deleteComment)


postRouter.route('/api/posts/feed/:userId')
    .get(postController.userFeed)

postRouter.route('/api/posts/:postId')
    .delete(postController.deletePost);

postRouter.route('/api/posts/:postId/comments')
    .get(postController.listComments)


postRouter.route('/api/posts/by/:userId').get(postController.postsByUser)

postRouter.param('userId', userController.userById);
postRouter.param('postId', postController.postById);

export default postRouter;