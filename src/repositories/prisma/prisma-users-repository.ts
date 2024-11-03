import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository-interface'

export class PrismaUsersRepository implements UsersRepository {
  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      // find unique procura apenas por chaves primarias ou
      // coisas unicas(referenciadas com @unique no prisma)
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
    // retornando pro caso de uso o usuario caso queiramos trablhar com as informaçoes
  }
}

// esse UserCreateInput do Prisma é um type que o prisma mesmo cria
// quando criamos uma tabela nova. tem input, update, etc(varias coisas),
// pra trazer inteligencia pro nosso codigo
// a ideia é que a gente saiba o tipo dos dados que vamos passar(as colunas
// do banco) e quais dados sao "passaveis"(campos obrigatorios e nao obrigatorios)

// obviamente se criassemos uma tabela chamada Gym, nao seria users, e sim
// GymCreateInput
