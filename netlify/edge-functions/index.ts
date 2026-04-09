import { Hono } from 'hono'
import { handle } from 'hono/netlify'
import taskRoutes from './routes/task-routes.ts'
import uiRoutes from './routes/ui-routes.ts'

const app = new Hono()

app.route('/', uiRoutes)
app.route('/tasks', taskRoutes)

export default handle(app)
