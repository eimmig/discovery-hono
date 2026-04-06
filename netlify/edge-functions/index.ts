import { Hono } from 'hono'
import { handle } from 'hono/netlify'
import taskRoutes from './routes/task-routes.ts'
import uiRoutes from './routes/ui-routes.ts'

const app = new Hono()

app.use('*', async (c, next) => {
  // Marker headers to verify requests are served by this Edge Function.
  c.header('x-edge-function', 'index')
  c.header('x-edge-runtime', 'netlify-edge')
  await next()
})

app.route('/', uiRoutes)
app.route('/tasks', taskRoutes)

export default handle(app)
