import { Hono } from 'hono'
import { handle } from 'hono/netlify'
import { homePageHtml, tasksPageHtml } from './lib/react-pages.ts'
import {
  createTask,
  getTaskById,
  listTasks,
  removeTaskById,
  updateTask,
} from './lib/task-service.ts'
import { isBoolean, isNonEmptyString, parseJsonBody } from './lib/http-utils.ts'

const app = new Hono()

app.use('*', async (c, next) => {
  // Marker headers to verify requests are served by this Edge Function.
  c.header('x-edge-function', 'index')
  c.header('x-edge-runtime', 'netlify-edge')
  await next()
})

app.get('/', (c) => {
  return c.html(homePageHtml())
})

app.get('/api', (c) => {
  return c.json({
    message: 'API CRUD de tarefas com Hono + Netlify Edge Functions',
    endpoints: {
      reactHome: 'GET /',
      reactTasks: 'GET /react/tasks',
      apiInfo: 'GET /api',
      list: 'GET /tasks',
      getOne: 'GET /tasks/:id',
      create: 'POST /tasks',
      update: 'PUT /tasks/:id',
      remove: 'DELETE /tasks/:id',
    },
  })
})

app.get('/react/tasks', (c) => {
  return c.html(tasksPageHtml())
})

app.get('/tasks', (c) => {
  return c.json({ data: listTasks() })
})

app.get('/tasks/:id', (c) => {
  const id = c.req.param('id')
  const task = getTaskById(id)

  if (!task) {
    return c.json({ error: 'Tarefa não encontrada.' }, 404)
  }

  return c.json({ data: task })
})

app.post('/tasks', async (c) => {
  const payload = await parseJsonBody(c.req.raw)
  if (payload instanceof Response) {
    return payload
  }

  if (!isNonEmptyString(payload.title)) {
    return c.json({ error: 'Campo "title" é obrigatório.' }, 422)
  }

  const task = createTask({
    title: payload.title.trim(),
    done: payload.done === true,
  })

  return c.json({ data: task }, 201)
})

app.put('/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const currentTask = getTaskById(id)

  if (!currentTask) {
    return c.json({ error: 'Tarefa não encontrada.' }, 404)
  }

  const payload = await parseJsonBody(c.req.raw)
  if (payload instanceof Response) {
    return payload
  }

  if (payload.title !== undefined && !isNonEmptyString(payload.title)) {
    return c.json({ error: 'Campo "title" inválido.' }, 422)
  }

  if (payload.done !== undefined && !isBoolean(payload.done)) {
    return c.json({ error: 'Campo "done" deve ser boolean.' }, 422)
  }

  const updatedTask = updateTask(currentTask, {
    title: payload.title === undefined ? undefined : payload.title.trim(),
    done: payload.done,
  })

  return c.json({ data: updatedTask })
})

app.delete('/tasks/:id', (c) => {
  const id = c.req.param('id')

  const removed = removeTaskById(id)
  if (!removed) {
    return c.json({ error: 'Tarefa não encontrada.' }, 404)
  }

  return c.json({ message: 'Tarefa removida com sucesso.' })
})

export default handle(app)
