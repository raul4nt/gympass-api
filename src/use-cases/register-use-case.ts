import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    // find unique procura apenas por chaves primarias ou
    // coisas unicas(referenciadas com @unique no prisma)
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
    // return reply.status(409).send() // não usaremos isso pq é especifico de rotas http,
    // e o usuario pode ser criado de diversmas formas, nem sempre por rota http,
    // por isso estamos separando em use-case

    // nunca tinha visto o status code 409
    // segundo o diego, é status code de conflito(dados duplicados ou enfim)
  }

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })

  // 6 = número de rounds, 6 é o valor ideal segundo o Diego
  // não tem como reverter o hash, mas na hora de logar conseguimos
  // gerar o hash novamente. pelo o que eu entendi, um hash da senha
  // '123456', usando 6 rounds, sempre será o mesmo hash digamos assim.
}
