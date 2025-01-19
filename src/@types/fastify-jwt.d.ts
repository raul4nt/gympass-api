import '@fastify/jwt'
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMIN' | 'MEMBER'
    }
  }
}

// corrigindo tipagem typescript do jwt pois estamos usando sub pra pegar
// o id do usuário e ele nao entende o tipo sozinho, temos que dizer
