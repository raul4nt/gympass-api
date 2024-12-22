import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
    // executando o use case
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
      // passando como undefined nos tiramos do objeto user o password_hash
      // dele, e, com isso, garantimos mais segurança. se nao tivesse essa linha,
      // ao dar um get na rota /me nos teriamos acesso tb ao hash da senha do usuario,
      // o que nao é mt seguro
    },
  })
}
