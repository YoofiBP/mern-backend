import {z} from "zod";
import {CommentSchema, PostSchema, UserSchema} from "../../../prisma/zod";

export const LikePayload = z.object({
    postID: PostSchema.shape.id,
    userID: UserSchema.shape.id
})

export const CommentPayload = z.object({
    postID: CommentSchema.shape.postId,
    userID: CommentSchema.shape.commenter,
    text: CommentSchema.shape.text
})