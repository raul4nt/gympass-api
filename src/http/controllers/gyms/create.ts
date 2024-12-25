import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      // quando nao queremos usar uma validaçao nativa do zod(como min  max, podemos
      // usar o refine pra escrevermos nossa validaçao. usamos o value pra pegar o valor do campo
      // e ai usando uma arrow function dizemos quando ele vai ser true, e se nao cumprir o que eu coloquei,
      // sera false, ou seja, caira no erro
      return Math.abs(value) <= 90
      // latitude tem que ser menor ou igual a 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
      // longitude tem que ser menor ou igual a 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
