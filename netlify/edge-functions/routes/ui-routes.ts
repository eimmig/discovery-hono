import { Hono } from 'hono'
import { homePageHtml, tasksPageHtml } from '../lib/react-pages.ts'

const uiRoutes = new Hono()

uiRoutes.get('/', (c) => {
  return c.html(homePageHtml())
})

uiRoutes.get('/api', (c) => {
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

uiRoutes.get('/react/tasks', (c) => {
  return c.html(tasksPageHtml())
})

export default uiRoutes
