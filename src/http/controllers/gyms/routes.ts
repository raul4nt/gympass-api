import { FastifyInstance } from 'fastify'

import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  // usando esse addHook onRequest com nossa funçao que verifica se existe
  // um jwt valido nos conseguimos usar o verifyJwt pra CADA ROTA que temos aqui,
  // isso ajuda, pois se nao teriamos que colocar em cada rota a mesma coisa, e desse jeito
  // ja vai pra todas
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
  app.post('/gyms', create)
}
