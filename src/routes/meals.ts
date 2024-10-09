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

    return reply.status(201).send({ message: 'Refeição criada com sucesso' })
  })

  app.put('/:id', async (request, reply) => {
    const updateMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      mealDatetime: z.string(),
      isDiet: z.boolean(),
    })

    const { id } = request.params as { id: string }

    const { name, description, mealDatetime, isDiet } = updateMealSchema.parse(
      request.body,
    )

    const result = await knex('meals').where({ id }).update({
      name,
      description,
      mealDatetime,
      isDiet,
    })

    if (result === 0) {
      return reply.status(404).send({ message: 'Refeição não encontrada' })
    }

    return reply
      .status(200)
      .send({ message: 'Refeição atualizada com sucesso' })
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const result = await knex('meals').where({ id }).del()

    if (result === 0) {
      return reply.status(404).send({ message: 'Refeição não encontrada' })
    }

    return reply.status(200).send({ message: 'Refeição deletada com sucesso' })
  })

  app.get('/user/:userId', async (request, reply) => {
    const paramsSchema = z.object({
      userId: z.string(),
    })

    const { userId } = paramsSchema.parse(request.params)

    try {
      const meals = await knex('meals').select('*').where('user_id', userId)

      if (meals.length === 0) {
        return reply
          .status(404)
          .send({ message: 'Nenhuma refeição encontrada para este usuário.' })
      }

      return reply.status(200).send(meals)
    } catch (error) {
      console.error(error)
      return reply.status(500).send({ message: 'Erro ao buscar refeições.' })
    }
  })

  app.get('/user/:userId/:id', async (request, reply) => {
    const paramsSchema = z.object({
      userId: z.string(),
      id: z.string(),
    })

    const { userId, id } = paramsSchema.parse(request.params)
    try {
      const meal = await knex('meals')
        .select('*')
        .where({ id, user_id: userId })

      if (meal.length === 0) {
        return reply.status(404).send({ message: 'Refeição não encontrada.' })
      }

      return reply.status(200).send(meal[0])
    } catch (error) {
      console.error(error)
      return reply.status(500).send({ message: 'Erro ao buscar a refeição.' })
    }
  })
}
