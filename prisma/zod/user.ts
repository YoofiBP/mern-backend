import * as z from "zod"
import { CompleteImage, RelatedImageSchema, CompletePost, RelatedPostSchema, CompleteComment, RelatedCommentSchema } from "./index"

export const UserSchema = z.object({
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

export interface CompleteUser extends z.infer<typeof UserSchema> {
  image?: CompleteImage | null
  followers: CompleteUser[]
  following: CompleteUser[]
  posts: CompletePost[]
  comments: CompleteComment[]
  postsLiked: CompletePost[]
}

/**
 * RelatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => UserSchema.extend({
  image: RelatedImageSchema.nullish(),
  followers: RelatedUserSchema.array(),
  following: RelatedUserSchema.array(),
  posts: RelatedPostSchema.array(),
  comments: RelatedCommentSchema.array(),
  postsLiked: RelatedPostSchema.array(),
}))
