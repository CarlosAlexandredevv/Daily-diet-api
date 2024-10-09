import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      mealDatetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid datetime',
      }),
      isDiet: z.boolean(),
    })

    const { name, description, mealDatetime, isDiet } = createMealSchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      mealDatetime: new Date(mealDatetime).toISOString(),
      isDiet,
    })
    return reply.status(201).send()
  })

  app.get('/', async () => {
    const meals = await knex('meals').select('*')
    return meals
  })
}
