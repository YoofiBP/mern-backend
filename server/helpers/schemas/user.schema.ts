import {z} from "zod";

export const FollowPayload = z.object({
    followerID: z.string(),
    followingID: z.string(),
})