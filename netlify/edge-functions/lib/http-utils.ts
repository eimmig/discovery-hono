export const jsonError = (message: string, status = 400) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export const parseJsonBody = async (
  request: Request
): Promise<Record<string, unknown> | Response> => {
  try {
    const payload = (await request.json()) as Record<string, unknown>
    if (!payload || typeof payload !== 'object') {
      return jsonError('Body deve ser um JSON valido.')
    }

    return payload
  } catch {
    return jsonError('Body invalido. Envie JSON valido.')
  }
}

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}
