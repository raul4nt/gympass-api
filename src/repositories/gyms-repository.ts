import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
  // usando assim fica muito mais descritivo o que é latitude e o que é
  // longitude: se fossemos colocar direto ali na interface de GymsRepository,
  // passariamos assim: findManyNearby(23101, 21301). ia ficar mt estranho
  // dessa forma com essa interface, fica: findManyNearby({ latitude: 21313, longitude: 201310 })
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
