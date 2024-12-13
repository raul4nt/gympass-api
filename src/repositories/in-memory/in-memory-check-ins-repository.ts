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

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId) // filtra os check-ins do usuário
      .slice((page - 1) * 20, page * 20) // aplica a paginação
    // aqui é feita a paginação dos check-ins. ou seja, a lógica é
    // baseada no número da página. se a página for 1, o cálculo será:
    // (1 - 1) * 20 = 0, então vai começar no item 0, e irá até o item 20 (page * 20).
    // ou seja, para a página 1, vai do check-in 1 ao 20. se a página for 2, o cálculo é:
    // (2 - 1) * 20 = 20, então começa do item 20 até o item 40 (page * 20).
    // isso faz com que, ao mudar de página, a lista mostre o intervalo correto de 20 check-ins por vez.
    // basicamente, você está mostrando 20 check-ins por página e, conforme o número da página,
    // o código ajusta a posição inicial e final dos itens.
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
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
