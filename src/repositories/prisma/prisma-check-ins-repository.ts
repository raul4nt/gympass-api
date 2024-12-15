import { prisma } from '@/lib/prisma'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      // uso findUnique pois id é campo unico pro prisma
      where: {
        id,
      },
    })
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    const checkIn = await prisma.checkIn.findFirst({
      // usamos findFirst quando o campo nao é unico(unique)
      // dá no mesmo, mas ao inves de usar findUnique usamos findFirst
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          // greater than or equal: data que seja maior ou igual ao início do dia
          lte: endOfTheDay.toDate(),
          // lower than or equal: data que seja menor ou igual ao fim do dia
        },
      },
    })
    return checkIn
    // findFirst já retorna nulo caso não ache nada, então nem precisamos fazer
    // validação adicional. se nao achar, aqui vai ser null. se achar, vai ser o checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      // uso findMany quando preciso de mais de uma informaçao(quando não é um só)
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      // o skip é pra definir certinho quantos vao aparecer em cada página
      // se a página for a 1, vai ser do 1 ao 20, se for a 2, do 21 ao 40, ...
      take: 20,
      // defino que quero 20 por página
    })
    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      // count do prisma é muito útil quando a ideia é só contar mesmo
      where: {
        user_id: userId,
        // contando quantos check-ins aquele user fez
      },
    })
    return count
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })
    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
    return checkIn
  }
}
