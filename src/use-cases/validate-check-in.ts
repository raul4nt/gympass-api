import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )
    // esse diff do dayjs pega a diferença de uma data pra outra. ali, estou usando o
    // 'minutes', ou seja, pegará a diferença em minutos da data de agora para a data
    // de criação do check-in
    // o objetivo é checar se passou de 20 minutos já de criação

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }
    // se a diferença for maior que 20 minutos, nao é pro usuario ter seu check-in
    // validado. lançarei um erro

    checkIn.validated_at = new Date()
    // se não der nada errado, check-in validado com sucesso

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
