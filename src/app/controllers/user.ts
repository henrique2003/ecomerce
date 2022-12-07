import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import prismaClient from '../prisma'
import { serverError } from '../helpers/errors'

export default class User {
  public async register (req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body

      const encriptedPassword = await bcrypt.hash(password, 10)

      const newUser = await prismaClient.user.create({
        data: {
          email,
          password: encriptedPassword
        }
      })

      delete newUser.password

      return res.status(201).json(newUser)
    } catch (error) {
      return serverError(res, error)
    }
  }
}
