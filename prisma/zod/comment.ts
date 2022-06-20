import * as z from "zod"
import { CompletePost, RelatedPostSchema, CompleteUser, RelatedUserSchema } from "./index"

export const CommentSchema = z.object({
  id: z.string(),
  v: z.number().int(),
  postId: z.string(),
  commenter: z.string(),
  createdAt: z.date(),
  text: z.string(),
})

export interface CompleteComment extends z.infer<typeof CommentSchema> {
  post: CompletePost
  user: CompleteUser
}

/**
 * RelatedCommentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommentSchema: z.ZodSchema<CompleteComment> = z.lazy(() => CommentSchema.extend({
  post: RelatedPostSchema,
  user: RelatedUserSchema,
}))
