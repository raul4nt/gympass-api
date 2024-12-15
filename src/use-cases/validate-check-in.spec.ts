import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
    // mocking de datas
  })

  afterEach(() => {
    vi.useRealTimers()
    // resetando mock
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // utc! isso seria primeiro de janeiro, as 13:40
    // brasil é utc-3

    // o setSystemTime seta o tempo do sistema para o que eu escolher

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
      // ou seja, aqui tem um created_at q pega o datetime atual e coloca no
      // objeto. como eu usei o setSystemTime pra colocar uma date fake, ele vai pegar
      // essa date na hora da criaçao
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    // 21 minutos em millissegundos

    vi.advanceTimersByTime(twentyOneMinutesInMs)
    // esse advanceTimersByTime avança o tempo conforme o tempo(em milissegundos)
    // que eu passar por parametro. neste caso, estou avançado o tempo em 21
    // minutos

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
    // quero que de erro, pois o usuario poderá apenas ter seu check-in validado
    // se ele tiver, no máximo, 20 minutos de tempo de criaçao
  })
})
