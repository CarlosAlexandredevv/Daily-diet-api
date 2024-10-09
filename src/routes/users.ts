import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
    })

    const { name } = createUserSchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })
    return reply.status(201).send()
  })

  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const { id } = request.params
    const users = await knex('users').select('*').where('id', id)
    return users
  })

  app.get('/', async () => {
    const users = await knex('users').select('*')
    return users
  })
}
