import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      totalMeals: z.number(),
      totalMealsInDiet: z.number(),
      totalMealsOutDiet: z.number(),
      streakMeals: z.number(),
    })

    const { name } = createUserSchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })
    return reply.status(201).send()
  })
  app.get('/', async () => {
    const users = await knex('users').select('*')
    return users
  })
}
