import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())
  // o error.format() pega todos os erros que aconteceram ao tentar usar
  // o envSchema e formatar de uma maneira mais amigável

  throw new Error('Invalid environment variables.')
  // não tem como a aplicação executar caso de problema nas variaveis de ambiente
}

export const env = _env.data
// exporta os dados de env
