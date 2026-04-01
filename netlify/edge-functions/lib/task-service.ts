export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}

export type TaskPayload = {
  title?: unknown
  done?: unknown
}

const tasks = new Map<string, Task>()

export const listTasks = (): Task[] => {
  return Array.from(tasks.values())
}

export const getTaskById = (id: string): Task | undefined => {
  return tasks.get(id)
}

export const createTask = (payload: { title: string; done: boolean }): Task => {
  const now = new Date().toISOString()
  const id = crypto.randomUUID()

  const task: Task = {
    id,
    title: payload.title,
    done: payload.done,
    createdAt: now,
    updatedAt: now,
  }

  tasks.set(id, task)
  return task
}

export const updateTask = (
  currentTask: Task,
  payload: { title?: string; done?: boolean }
): Task => {
  const updatedTask: Task = {
    ...currentTask,
    title: payload.title ?? currentTask.title,
    done: payload.done ?? currentTask.done,
    updatedAt: new Date().toISOString(),
  }

  tasks.set(currentTask.id, updatedTask)
  return updatedTask
}

export const removeTaskById = (id: string): boolean => {
  return tasks.delete(id)
}
