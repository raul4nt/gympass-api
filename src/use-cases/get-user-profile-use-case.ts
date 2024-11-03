import { UsersRepository } from '@/repositories/users-repository-interface'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// tipagem de entrada
interface GetUserProfileUseCaseRequest {
  userId: string
}

// tiapgem de saída
interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
