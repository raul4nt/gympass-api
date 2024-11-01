import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register-use-case'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
    // espero que o id do usuário retornado por esta função seja
    // qualquer string
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    // o compare do bcrypt serve justamente pra comparar duas
    // senhas, ajudando a descobrir se o hash esta funcionando mesmo
    // vai retornar true ou false, dependendo do resultado da  comparaçao

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    // usando await pq é uma promise(estamos usando rejects)
    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    // promises ou dao resolve ou reject. resolve = deu certo, reject =
    // deu erro. o vitest tem o rejects e o resolves, para podermos usar o
    // expect em ambos casos. neste caso, eu espero que rejeite, e que a rejeiçao
    // seja de uma instancia UserAlreadyExistsError, que é o erro que deveria dar
    // quando o usuario ja existe(email repetido)
    // ou seja, estamos buscando o retorno vindo através desta rejeição
  })
})
