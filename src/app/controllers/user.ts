import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { v4 as uuidv4 } from 'uuid'

import prismaClient from '../prisma'
import { serverError, badRequest, success, createSuccess } from '../helpers/response-status'
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

      if (await prismaClient.user.findUnique({ where: { email } })) {
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

      return createSuccess(res, { newUser, token })
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

      // Generate token
      const token = generateToken(user.id)

      return success(res, { user, token })
    } catch (error) {
      return serverError(res, error)
    }
  }

  public async addProductOnCart (req: Request, res: Response): Promise<Response> {
    try {
      const { userId, body } = req

      let { productId } = body

      productId = productId.toString()

      // Verify if exist product
      const product = await prismaClient.product.findUnique({ where: { id: productId } })

      if (!product) {
        return badRequest(res, 'Produto inválido')
      }

      // Update cart from user
      const transaction = await prismaClient.transaction.create({
        data: {
          id: uuidv4(),
          userId,
          productId
        },
        include: {
          products: true
        }
      })

      return success(res, transaction)
    } catch (error) {
      return serverError(res, error)
    }
  }

  public async removeProductOnCart (req: Request, res: Response): Promise<Response> {
    try {
      const { transactionId } = req.body

      // Verify if exist product
      if (!await prismaClient.transaction.findUnique({ where: { id: transactionId } })) {
        return badRequest(res, 'Transação inválida')
      }

      await prismaClient.transaction.delete({
        where: { id: transactionId }
      })

      return res.status(202).json({ message: 'Produto removido' })
    } catch (error) {
      return serverError(res, error)
    }
  }

  public async loadUser (req: Request, res: Response): Promise<Response> {
    try {
      const user = await prismaClient.user.findUnique({
        where: {
          id: req.userId
        },
        include: {
          Transaction: {
            include: {
              products: true
            }
          }
        }
      })
      delete user.password

      return success(res, user)
    } catch (error) {
      return serverError(res, error)
    }
  }
}
