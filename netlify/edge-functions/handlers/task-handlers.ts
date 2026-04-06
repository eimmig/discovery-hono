import type { Context } from 'hono'
import { parseJsonBody } from '../lib/http-utils.ts'
import {
  createTask,
  getTaskById,
  listTasks,
  removeTaskById,
  updateTask,
} from '../services/task-service.ts'
import {
  validateCreateTaskPayload,
  validateUpdateTaskPayload,
} from '../validators/task-validator.ts'

export const listTasksHandler = (c: Context) => {
  return c.json({ data: listTasks() })
}

export const getTaskByIdHandler = (c: Context) => {
  const id = c.req.param('id')
  if (!id) {
    return c.json({ error: 'Parametro "id" e obrigatorio.' }, 400)
  }

  const task = getTaskById(id)

  if (!task) {
    return c.json({ error: 'Tarefa nao encontrada.' }, 404)
  }

  return c.json({ data: task })
}

export const createTaskHandler = async (c: Context) => {
  const payload = await parseJsonBody(c.req.raw)
  if (payload instanceof Response) {
    return payload
  }

  const validated = validateCreateTaskPayload(payload)
  if (validated.error || !validated.data) {
    return c.json({ error: validated.error ?? 'Payload invalido.' }, 422)
  }

  const task = createTask(validated.data)
  return c.json({ data: task }, 201)
}

export const updateTaskHandler = async (c: Context) => {
  const id = c.req.param('id')
  if (!id) {
    return c.json({ error: 'Parametro "id" e obrigatorio.' }, 400)
  }

  const currentTask = getTaskById(id)

  if (!currentTask) {
    return c.json({ error: 'Tarefa nao encontrada.' }, 404)
  }

  const payload = await parseJsonBody(c.req.raw)
  if (payload instanceof Response) {
    return payload
  }

  const validated = validateUpdateTaskPayload(payload)
  if (validated.error || !validated.data) {
    return c.json({ error: validated.error ?? 'Payload invalido.' }, 422)
  }

  const updatedTask = updateTask(currentTask, validated.data)
  return c.json({ data: updatedTask })
}

export const deleteTaskHandler = (c: Context) => {
  const id = c.req.param('id')
  if (!id) {
    return c.json({ error: 'Parametro "id" e obrigatorio.' }, 400)
  }

  const removed = removeTaskById(id)

  if (!removed) {
    return c.json({ error: 'Tarefa nao encontrada.' }, 404)
  }

  return c.json({ message: 'Tarefa removida com sucesso.' })
}
