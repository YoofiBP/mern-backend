import * as z from "zod"
import {CompleteImage, CompleteUser, RelatedUserSchema, CompleteComment, RelatedCommentSchema} from "./index"

export const PostSchema = z.object({
    id: z.string(),
    v: z.number().int(),
    content: z.string(),
    postedBy: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    likeIDs: z.string().array(),
})

export interface CompletePost extends z.infer<typeof PostSchema> {
    photo?: CompleteImage | null
    user: CompleteUser
    comments: CompleteComment[]
    likers: CompleteUser[]
}

/**
 * RelatedPostSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPostSchema: z.ZodSchema<CompletePost> = z.lazy(() => PostSchema.extend({
    photo: RelatedImageSchema.nullish(),
    user: RelatedUserSchema,
    comments: RelatedCommentSchema.array(),
    likers: RelatedUserSchema.array(),
}))
