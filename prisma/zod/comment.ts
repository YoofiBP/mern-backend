import * as z from "zod"
import { CompletePost, RelatedPostModel, CompleteUser, RelatedUserModel } from "./index"

export const CommentModel = z.object({
  id: z.string(),
  v: z.number().int(),
  postId: z.string(),
  commenter: z.string(),
  createdAt: z.date(),
  text: z.string(),
})

export interface CompleteComment extends z.infer<typeof CommentModel> {
  post: CompletePost
  user: CompleteUser
}

/**
 * RelatedCommentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommentModel: z.ZodSchema<CompleteComment> = z.lazy(() => CommentModel.extend({
  post: RelatedPostModel,
  user: RelatedUserModel,
}))
