import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  // este UncheckedCreateInput difere do CreateInput normal pois neste caso
  // como temos relaçoes entre tabelas, so conseguiriamos colocar um gym id
  // e um userId que ja estejam registrados no banco de dados(previamente criados)
}
