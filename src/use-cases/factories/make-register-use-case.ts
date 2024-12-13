import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
  // factorie = centralizador de criação do nosso use case
  // neste caso tenho apenas uma dependencia só(usersrepository),
  // mas quanto mais dependencias eu tenho, mais chato seria pra importar cada uma
  // e colocar dentro do usecase manualmente em cada arquivo q eu for usar ela.
  // agora nao, só preciso importar meu factorie e pronto
}
