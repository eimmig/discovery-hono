import { isBoolean, isNonEmptyString } from '../lib/http-utils.ts'

export type CreateTaskInput = {
  title: string
  done: boolean
}

export type UpdateTaskInput = {
  title?: string
  done?: boolean
}

export const validateCreateTaskPayload = (
  payload: Record<string, unknown>
): { data?: CreateTaskInput; error?: string } => {
  if (!isNonEmptyString(payload.title)) {
    return { error: 'Campo "title" e obrigatorio.' }
  }

  return {
    data: {
      title: payload.title.trim(),
      done: payload.done === true,
    },
  }
}

export const validateUpdateTaskPayload = (
  payload: Record<string, unknown>
): { data?: UpdateTaskInput; error?: string } => {
  if (payload.title !== undefined && !isNonEmptyString(payload.title)) {
    return { error: 'Campo "title" invalido.' }
  }

  if (payload.done !== undefined && !isBoolean(payload.done)) {
    return { error: 'Campo "done" deve ser boolean.' }
  }

  return {
    data: {
      title: payload.title === undefined ? undefined : payload.title.trim(),
      done: payload.done as boolean | undefined,
    },
  }
}
