import {PrismaClient} from "@prisma/client";
import prisma from "../prisma/prisma";
import {z} from 'zod';
import {CommentPayload} from "../helpers/schemas/post.schema";
import {CommentSchema} from "../../prisma/zod";

class Comment {
    private commentModel: PrismaClient['comment'];

    constructor(commentModel: PrismaClient['comment']) {
        this.commentModel = commentModel;
    }

    createPostComment = async ({userID, postID, text}: z.infer<typeof CommentPayload>) => {
        return await this.commentModel.create({
            data: {
                text,
                commenter: userID,
                postId: postID
            }
        })
    }

    deleteComment = async (id: z.infer<typeof CommentSchema>['id']) => {
        return await this.commentModel.delete({
            where: {
                id
            }
        })
    }

}

export default new Comment(prisma.comment)