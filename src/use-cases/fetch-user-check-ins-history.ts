import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryUseCaseUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseUseCaseResponse {
  checkIns: CheckIn[]
  // retorna uma lista de check ins
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
