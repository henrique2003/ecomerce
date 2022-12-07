import { Response } from 'express'

export function serverError (res: Response, error: any): Response {
  return res.status(500).json({ error })
}

export function badRequest (res: Response, message: string): Response {
  return res.status(400).json({ message })
}

export function success (res: Response, data: any): Response {
  return res.status(200).json(data)
}
