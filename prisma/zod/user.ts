import * as z from "zod"
import { CompleteImage, RelatedImageModel, CompletePost, RelatedPostModel, CompleteComment, RelatedCommentModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  v: z.number().int(),
  createdAt: z.date(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  salt: z.string(),
  updatedAt: z.date(),
  about: z.string().nullish(),
  followersIDs: z.string().array(),
  followingIDs: z.string().array(),
  postsLikedIDs: z.string().array(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  image?: CompleteImage | null
  followers: CompleteUser[]
  following: CompleteUser[]
  posts: CompletePost[]
  comments: CompleteComment[]
  postsLiked: CompletePost[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  image: RelatedImageModel.nullish(),
  followers: RelatedUserModel.array(),
  following: RelatedUserModel.array(),
  posts: RelatedPostModel.array(),
  comments: RelatedCommentModel.array(),
  postsLiked: RelatedPostModel.array(),
}))
