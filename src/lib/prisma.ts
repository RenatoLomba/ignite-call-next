import { PrismaClient } from '@prisma/client'

const isProduction = process.env.NODE_ENV === 'production'

export const prisma = new PrismaClient({
  log: isProduction ? ['error'] : ['query', 'error'],
})
