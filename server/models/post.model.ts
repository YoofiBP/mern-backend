import prisma from "../prisma/prisma";
import {PrismaClient} from "@prisma/client";
import {z} from "zod";
import {PostData} from "../helpers/schemas/post.schema";
import {ValidationError} from "../helpers/dbErrorHandler";

class Post {
    private postModel: PrismaClient['post'];

    constructor(postModel: PrismaClient['post']) {
        this.postModel = postModel;
    }

    getAllPosts = async () => {
        return await this.postModel.findMany();
    }

    createPost = async ({content, postedBy}: z.infer<typeof PostData>) => {
        if (content.length < 1) {
            throw new ValidationError({
                content: 'Content required'
            });
        }

        if (typeof postedBy !== 'string') {
            throw new ValidationError({
                author: 'Post needs an author'
            })
        }

        await this.postModel.create({
            data: {
                content,
                postedBy
            }
        })
    }
}

export default new Post(prisma.post);