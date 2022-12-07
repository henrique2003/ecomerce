import { Response } from 'express'

export function serverError (res: Response, error: any): Response {
  return res.status(500).json({ error })
}
