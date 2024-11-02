import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate-use-case'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)
    // sut significa system under test, e é usada para usar sempre o
    // mesmo nome da variável principal em todos os testes. isso facilita
    // caso a gente copie um código de teste para reutilizar em outro, pois
    // evita a fadiga de substituir o nome de todas as variaveis onde usa o useCase

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)
    // sut significa system under test, e é usada para usar sempre o
    // mesmo nome da variável principal em todos os testes. isso facilita
    // caso a gente copie um código de teste para reutilizar em outro, pois
    // evita a fadiga de substituir o nome de todas as variaveis onde usa o useCase

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)
    // sut significa system under test, e é usada para usar sempre o
    // mesmo nome da variável principal em todos os testes. isso facilita
    // caso a gente copie um código de teste para reutilizar em outro, pois
    // evita a fadiga de substituir o nome de todas as variaveis onde usa o useCase

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123131',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
