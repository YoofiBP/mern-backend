import * as z from "zod"
import { CompleteImage, RelatedImageModel, CompleteUser, RelatedUserModel, CompleteComment, RelatedCommentModel } from "./index"

export const PostModel = z.object({
  id: z.string(),
  v: z.number().int(),
  content: z.string(),
  postedBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  likeIDs: z.string().array(),
})

export interface CompletePost extends z.infer<typeof PostModel> {
  photo?: CompleteImage | null
  user: CompleteUser
  comments: CompleteComment[]
  likers: CompleteUser[]
}

/**
 * RelatedPostModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPostModel: z.ZodSchema<CompletePost> = z.lazy(() => PostModel.extend({
  photo: RelatedImageModel.nullish(),
  user: RelatedUserModel,
  comments: RelatedCommentModel.array(),
  likers: RelatedUserModel.array(),
}))
