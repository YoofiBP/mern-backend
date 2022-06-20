import PostModel from '../models/post.model';
import {PostData} from "../helpers/schemas/post.schema";
import {ValidationError} from "../helpers/dbErrorHandler";
import {ZodError} from "zod";
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
        const {content, postedBy} = PostData.parse(req.body)
        await PostModel.createPost({content, postedBy});
        return res.status(200).json()
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

export default {
    list,
    store
}