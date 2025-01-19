import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
        // salvando no payload o role do usuario logado
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )
    // esse jwtsign é o que faz a gente logar, basicamente
    // estamos passando no payload como 'sub" o user_id do usuário
    // pra conseguirmos identificar ele entre as requisições(saber
    // quem está logado)
    // isso gera um token pro nosso usuário caso a senha e email estejam corretos

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
        // salvando no payload o role do usuario logado(refreshtoken)
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
          // tempo de expiração
          // refreshToken será maior que o token padrão(mas nao podemos exagerar no tempo)
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        // criamos um cookie pro refreshToken pois ele é um token
        // que não deve ser acessível para o back-end da aplicação
        path: '/',
        // path define que rotas poderam usa-lo, neste caso colocamos que todas
        secure: true,
        // garante que o front-end nao conseguira ler o token como uma informaçao
        // bruta
        sameSite: true,
        // definimos que o cookie sera acessado apenas pelo mesmo dominio
        httpOnly: true,
        // cookie será acessado apenas pelo back-end(atraves de reply e request)
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
