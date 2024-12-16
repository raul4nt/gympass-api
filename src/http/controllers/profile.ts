import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()
  // busca o token do cabeçalho e verifica se este token foi realmente gerado
  // pelo nosso app com base na nossa JWT_SECRET

  return reply.status(200).send()
}
