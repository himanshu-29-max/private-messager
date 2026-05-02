import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

let prismaClient: PrismaClient;

try {
  prismaClient = globalForPrisma.prisma || new PrismaClient({
    log: ['error'],
  })
} catch (error) {
  console.warn("Prisma initialization bypassed during build evaluation.");
  prismaClient = {} as PrismaClient;
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
