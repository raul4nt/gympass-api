import { FastifyInstance } from 'fastify'
// import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)

  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)
  // iremos passar o gymId pelo query params(pela rota)

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
  // iremos passar o checkInId pelo query params(pela rota)
}
