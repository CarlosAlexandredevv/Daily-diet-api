import fastify from 'fastify'
import { env } from './env'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

const app = fastify()

app.register(usersRoutes)
app.register(mealsRoutes)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
