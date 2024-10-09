import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.integer('totalMeals').notNullable()
    table.integer('totalMealsInDiet').notNullable()
    table.integer('totalMealsOutDiet').notNullable()
    table.integer('streakMeals').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
