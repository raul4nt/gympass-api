import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    // busca o token do cabeçalho e verifica se este token foi realmente gerado
    // pelo nosso app com base na nossa JWT_SECRET
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
