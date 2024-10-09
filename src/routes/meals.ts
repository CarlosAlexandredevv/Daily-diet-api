import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      mealDatetime: z.string(),
      isDiet: z.boolean(),
      userId: z.string(),
    })

    const { name, description, mealDatetime, isDiet, userId } =
      createMealSchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      mealDatetime,
      isDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
