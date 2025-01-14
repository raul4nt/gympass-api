import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })
  // verifica jwt, mas com o onlyCookie(nao verá o cabeçalho)
  // ou seja, olha apenas pros cookies, pra ver se lá existe o
  // refresh token

  // gerando um novo token(que o front-end utilizará):

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        // dados do usuário logado atualmente na aplicação
      },
    },
  )

  // gerando um novo refresh token:

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
