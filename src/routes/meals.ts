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
      userId: z.string(),
    })

    const { id } = request.params as { id: string }
    const { name, description, mealDatetime, isDiet, userId } =
      updateMealSchema.parse(request.body)

    const meal = await knex('meals').where({ id, user_id: userId }).first()

    if (!meal) {
      return reply
        .status(404)
        .send({ message: 'Refeição não encontrada ou não pertence ao usuário' })
    }

    await knex('meals').where({ id }).update({
      name,
      description,
      mealDatetime,
      isDiet,
    })

    return reply
      .status(200)
      .send({ message: 'Refeição atualizada com sucesso' })
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { userId } = request.query as { userId: string }

    const meal = await knex('meals').where({ id, user_id: userId }).first()

    if (!meal) {
      return reply
        .status(404)
        .send({ message: 'Refeição não encontrada ou não pertence ao usuário' })
    }

    await knex('meals').where({ id }).del()

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

  app.get('/user/:userId/metrics', async (request, reply) => {
    const paramsSchema = z.object({
      userId: z.string(),
    })

    const { userId } = paramsSchema.parse(request.params)

    try {
      const totalMeals = await knex('meals')
        .where('user_id', userId)
        .count('* as count')
        .first()
      const totalDietMeals = await knex('meals')
        .where({ user_id: userId, isDiet: true })
        .count('* as count')
        .first()
      const totalNonDietMeals = await knex('meals')
        .where({ user_id: userId, isDiet: false })
        .count('* as count')
        .first()

      const meals = await knex('meals')
        .where('user_id', userId)
        .orderBy('mealDatetime', 'asc')
      let bestDietStreak = 0
      let currentStreak = 0

      meals.forEach((meal) => {
        if (meal.isDiet) {
          currentStreak++
          if (currentStreak > bestDietStreak) {
            bestDietStreak = currentStreak
          }
        } else {
          currentStreak = 0
        }
      })

      return reply.status(200).send({
        totalMeals: totalMeals?.count ?? 0,
        totalDietMeals: totalDietMeals?.count ?? 0,
        totalNonDietMeals: totalNonDietMeals?.count ?? 0,
        bestDietStreak,
      })
    } catch (error) {
      console.error(error)
      return reply.status(500).send({ message: 'Erro ao buscar métricas.' })
    }
  })
}
