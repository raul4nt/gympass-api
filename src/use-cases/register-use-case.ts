import { UsersRepository } from '@/repositories/users-repository-interface'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// SOLID
// D- Dependency Inversion Principle

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // const prismaUsersRepository = new PrismaUsersRepository()

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}

// return reply.status(409).send() // não usaremos isso pq é especifico de rotas http,
// e o usuario pode ser criado de diversmas formas, nem sempre por rota http,
// por isso estamos separando em use-case

// nunca tinha visto o status code 409
// segundo o diego, é status code de conflito(dados duplicados ou enfim)

// 6 = número de rounds, 6 é o valor ideal segundo o Diego
// não tem como reverter o hash, mas na hora de logar conseguimos
// gerar o hash novamente. pelo o que eu entendi, um hash da senha
// '123456', usando 6 rounds, sempre será o mesmo hash digamos assim.
