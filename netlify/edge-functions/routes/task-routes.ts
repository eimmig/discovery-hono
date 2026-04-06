import { Hono } from 'hono'
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  listTasksHandler,
  updateTaskHandler,
} from '../handlers/task-handlers.ts'

const taskRoutes = new Hono()

taskRoutes.get('/', listTasksHandler)
taskRoutes.get('/:id', getTaskByIdHandler)
taskRoutes.post('/', createTaskHandler)
taskRoutes.put('/:id', updateTaskHandler)
taskRoutes.delete('/:id', deleteTaskHandler)

export default taskRoutes
