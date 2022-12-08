import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'

import prismaClient from '../prisma'
import { serverError, badRequest, success } from '../helpers/response-status'
import generateToken from '../utils/generateToken'

export default class User {
  public async register (req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body

      if (!password.trim()) {
        return badRequest(res, 'Senha em branco')
      }

      if (!validator.isEmail(email)) {
        return badRequest(res, 'Email inválido')
      }

      if (prismaClient.user.findUnique({ where: { email } })) {
        return badRequest(res, 'Email já esta em uso')
      }

      const encriptedPassword = await bcrypt.hash(password, 10)

      const newUser = await prismaClient.user.create({
        data: {
          email,
          password: encriptedPassword
        }
      })

      delete newUser.password

      // Generate token
      const token = generateToken(newUser.id)

      return res.status(201).json({ newUser, token })
    } catch (error) {
      return serverError(res, error)
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body

      // Validations
      if (!password.trim()) {
        return badRequest(res, 'Senha em branco')
      }

      if (!validator.isEmail(email)) {
        return badRequest(res, 'Email inválido')
      }

      // Login
      const user = await prismaClient.user.findUnique({ where: { email } })

      if (!user) {
        return badRequest(res, 'Usuário não encontrado')
      }

      if (!await bcrypt.compare(password, user.password)) {
        return badRequest(res, 'Senha invalida')
      }

      delete user.password

      // Generate token}, process.env.JWT_SECRET_ID, { expiresIn: '1d' })
      const token = generateToken(user.id)

      return success(res, { user, token })
    } catch (error) {
      return serverError(res, error)
    }
  }
}
