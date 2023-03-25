import { AppRouter } from "@/server/routers/_app";
import { inferProcedureOutput } from "@trpc/server";

export type Post = inferProcedureOutput<AppRouter['post']['all']>[number];