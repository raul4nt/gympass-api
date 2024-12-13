import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { Prisma, CheckIn } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    // 2023-02-28...hora...
    // startOf pega 2023-02-28T00:00:00
    // o startOf pega o inicio do dia, logo quando o dia vira(tudo zerado)
    const endOfTheDay = dayjs(date).endOf('date')
    // mesma coisa, mas agora pega no ultimo minuto/segundo do dia

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      // retorna boolean - valida se a data esta no intervalo de duas outras datas(start e end of the day)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      // foi passada uma data de validaçao? se sim, transformo em date, se nao, nulo
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }
}
