
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '@/utils/prisma';

// create context based of incoming request
export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions,
) => {
  return {
    req: opts?.req,
    prisma,
    post: prisma.post,
  };
};
export type Context = trpc.inferAsyncReturnType<typeof createContext>;