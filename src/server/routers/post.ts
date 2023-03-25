import { z } from "zod";
import { router, procedure } from "../trpc";

export const postRouter = router({
    all: procedure.query(({ctx}) => {
        return ctx.post.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        })
    }),
    add: procedure.input(
        z.object({
            title: z.string().min(5),
            description: z.string(),
            author: z.string(),
        }),
    )
    .output(z.object({
        title: z.string().min(5),
        description: z.string(),
        author: z.string(),
    }))
    .mutation(async ({ctx, input}) => {
        const todo = await ctx.post.create({
            data: input
        })

        return todo
    })
})