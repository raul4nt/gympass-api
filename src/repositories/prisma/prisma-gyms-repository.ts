import { Prisma, Gym } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // query raw = query "crua", ou seja, escrevemos ela na mão
    // aquele código de sql o Diego passou direto, foi ctrl C e ctrl V,
    // mas básicamente ele checa as academias que estão a menos de 10 km
    // de distância usando vários conceitos matemáticos semelhantes ao
    // get coordinates que usamos no in memory gyms repository

    // ali dentro do <> defino o que vai ser o retorno, pois o prisma não consegue
    // entender sem dizermos isso pra ele(quando usamos o query raw)
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          // este contains é interessante -> consigo ver as academias que
          // CONTÉM o que eu estou buscando. assim, ela não precisa ter o titulo
          // exatamente igual ao que eu estou pesquisando. se eu pesquisar por Java
          // e existir uma academia chamada JavaScript Gym, usando o contains eu acharei ela,
          // pois JavaScript Gym contém Java
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
