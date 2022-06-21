import PostModel from '../models/post.model';
import CommentModel from '../models/comment.model';
import {CommentSchema, PostSchema} from "../../prisma/zod";
import {ValidationError} from "../helpers/dbErrorHandler";
import {ZodError, z} from "zod";
import dbErrorHandler from "../helpers/dbErrorHandler";
import {CommentPayload, LikePayload} from "../helpers/schemas/post.schema";


const list = async (req, res, next) => {
    try {
        const posts = await PostModel.getAllPosts();
        return res.status(200).json(posts);
    } catch (e) {
        console.log(e)
        next(e);
    }
}

const store = async (req, res, next) => {
    try {
        const {content, postedBy} = PostSchema.pick({
            content: true,
            postedBy: true,
        }).parse(req.body)
        const post = await PostModel.createPost({content, postedBy});
        return res.status(200).json(post)
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(422).json(e.errors)
        }
        if (e instanceof ZodError) {
            return res.status(422).json(dbErrorHandler.processZodError(e))
        }
        next(e);
    }
}

const userFeed = async (req, res, next) => {
    try {
        const user = req.user;
        const posts = await PostModel.getFeedForUser(user.id);
        return res.status(200).json(posts ?? [])
    } catch (e) {
        next(e)
    }
}

const postsByUser = async (req, res, next) => {
    try {
        const user = req.user;
        const posts = await PostModel.getUserPosts(user.id);
        return res.status(200).json(posts ?? [])
    } catch (e) {
        console.error(e);
        next(e)
    }
}

const deletePost = async (req, res, next) => {
    try {
        const post = req.post as z.infer<typeof PostSchema>;
        await PostModel.deletePost(post.id);
        return res.status(204).send()
    } catch (e) {
        next(e)
    }
}

const postById = async (req, res, next, id) => {
    try {
        req.post = await PostModel.getPost(id);
        return next();
    } catch (e) {
        return next(e)
    }
}

const likePost = async (req, res, next) => {
    try {
        const {postID, userID} = LikePayload.parse(req.body);
        await PostModel.likePost({
            postID,
            userID
        })
        return res.status(200).send()
    } catch (e) {
        next(e)
    }
}

const unLikePost = async (req, res, next) => {
    try {
        const {postID, userID} = LikePayload.parse(req.body);
        await PostModel.unLikePost({
            postID,
            userID
        })
        return res.status(200).send()
    } catch (e) {
        next(e)
    }
}

const commentOnPost = async (req, res, next) => {
    try {
        const {postID, userID, text} = CommentPayload.parse(req.body);
        const comment = await CommentModel.createPostComment({
            postID,
            userID,
            text
        })
        return res.status(200).json(comment)
    } catch (e) {
        next(e)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const {id} = CommentSchema.pick({
            id: true
        }).parse(req.body)
        await CommentModel.deleteComment(id)
        return res.status(200).send();
    } catch (e) {
        next(e)
    }
}

const listComments = async (req, res, next) => {
    try {
        const {comments} = await PostModel.getComments(req.post.id);
        res.status(200).json(comments);
    } catch (e) {
        next(e)
    }
}

export default {
    list,
    store,
    userFeed,
    postsByUser,
    postById,
    deletePost,
    likePost,
    unLikePost,
    commentOnPost,
    deleteComment,
    listComments
}