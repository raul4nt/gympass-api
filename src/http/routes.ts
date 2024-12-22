import { FastifyInstance } from 'fastify'
import { authenticate } from '@/http/controllers/authenticate'
import { register } from './controllers/register'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  // onRequest executa antes do controller, passa o nosso request e reply
  // pra dentro do jwt pra garantir que ele exista, se nao ja da erro
}
