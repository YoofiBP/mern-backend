import PostModel from '../models/post.model';
import {PostSchema} from "../../prisma/zod";
import {ValidationError} from "../helpers/dbErrorHandler";
import {ZodError, z} from "zod";
import dbErrorHandler from "../helpers/dbErrorHandler";


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


export default {
    list,
    store,
    userFeed,
    postsByUser,
    postById,
    deletePost
}