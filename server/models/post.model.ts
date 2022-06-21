import prisma from "../prisma/prisma";
import {PrismaClient} from "@prisma/client";
import {z} from "zod";
import {PostSchema, UserSchema} from "../../prisma/zod";
import {ValidationError} from "../helpers/dbErrorHandler";
import UserModel from "./user.model";
import {LikePayload} from "../helpers/schemas/post.schema";

class Post {
    private postModel: PrismaClient['post'];

    constructor(postModel: PrismaClient['post']) {
        this.postModel = postModel;
    }

    deletePost = async (postID: z.infer<typeof PostSchema>['id']) => {
        await this.postModel.delete(
            {
                where: {
                    id: postID
                }
            }
        )
    }

    getPost = async (postID: z.infer<typeof PostSchema>['id']) => {
        const post = await this.postModel.findUnique({
            where: {
                id: postID
            },
            rejectOnNotFound: true
        })

        if (!post) {
            throw new ValidationError({
                error: 'Not found'
            })
        }

        return post;
    }

    getAllPosts = async () => {
        return await this.postModel.findMany();
    }

    getFeedForUser = async (userID: z.infer<typeof UserSchema>['id']) => {
        const userFollowingIDs = await UserModel.findFollowing(userID);
        return await this.postModel.findMany({
            where: {
                postedBy: {
                    in: userFollowingIDs
                }
            }
        })
    }

    getUserPosts = async (userID: z.infer<typeof UserSchema>['id']) => {
        return await this.postModel.findMany({
            where: {
                postedBy: userID
            }
        })
    }

    likePost = async ({postID, userID}: z.infer<typeof LikePayload>) => {
        await this.postModel.update({
                where: {
                    id: postID
                },
                data: {
                    likeIDs: {
                        push: userID
                    }
                }
            }
        )
    }

    unLikePost = async ({postID, userID}: z.infer<typeof LikePayload>) => {
        const post = await this.postModel.findUnique({
            where: {
                id: postID
            }
        })
        const newLikeIDs = post.likeIDs.filter(id => id !== userID)
        await this.postModel.update({
                where: {
                    id: postID
                },
                data: {
                    likeIDs: {
                        set: newLikeIDs
                    }
                }
            }
        )
    }

    createPost = async ({content, postedBy}: z.infer<typeof PostSchema>) => {
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

        return await this.postModel.create({
            data: {
                content,
                postedBy
            }
        })
    }

    getComments = async (postID: z.infer<typeof PostSchema>['id']) => {
        return await this.postModel.findUnique({
            where: {
                id: postID
            },
            select: {
                comments: true
            }
        })
    }
}


export default new Post(prisma.post);