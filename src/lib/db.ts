import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

let prismaClient: PrismaClient;

try {
  if (globalForPrisma.prisma) {
    prismaClient = globalForPrisma.prisma;
  } else {
    // Only initialize the pool if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      const adapter = new PrismaPg(pool)
      prismaClient = new PrismaClient({ adapter, log: ['error'] })
    } else {
      throw new Error("No DATABASE_URL");
    }
  }
} catch (error) {
  console.warn("Prisma initialization bypassed during build evaluation.");
  prismaClient = {} as PrismaClient;
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
