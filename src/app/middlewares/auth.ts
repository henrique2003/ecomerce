import 'dotenv/config'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { unauthorized } from '../helpers/response-status'

export function auth (req: Request, res: Response, next: NextFunction): Response {
  const authToken = req.header('authorization')

  if (!authToken) {
    return unauthorized(res)
  }

  try {
    const [, token] = authToken.split(' ')

    const { id } = verify(token, process.env.JWT_SECRET_ID) as { id: string }

    req.userId = id

    next()
  } catch (error) {
    return unauthorized(res)
  }
}
