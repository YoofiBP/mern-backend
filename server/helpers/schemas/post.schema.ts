import {z} from "zod";

export const PostData = z.object({
    content: z.string(),
    photo: z.object({
        data: z.string(),
        contentType: z.string()
    }).nullish(),
    postedBy: z.string()
})