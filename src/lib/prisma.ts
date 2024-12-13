import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
  // mostra os comandos que o prisma fez no bd(as querys puras)
  // o log sera query apenas se estivermos em ambiente de dev
})
