import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'

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

      const { id, cost, title, type } = product

      // Update cart from user
      const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: {
          cart: {
            connectOrCreate: {
              where: { id },
              create: {
                cost,
                id,
                title,
                type
              }
            }
          }
        }
      })

      return success(res, updatedUser)
    } catch (error) {
      console.log(error.message)

      return serverError(res, error)
    }
  }

  // public async removeProductOnCart (req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { userId, body } = req

  //     let { productId } = body

  //     productId = productId.toString()

  //     // Verify if exist product
  //     if (!await prismaClient.product.findUnique({ where: { id: productId } })) {
  //       return badRequest(res, 'Produto inválido')
  //     }
  //     console.log('1')

  //     // Update cart from user
  //     const user = await prismaClient.user.update({
  //       where: { id: userId },
  //       data: {
  //         cart: {
  //           delete: {
  //             id: productId
  //           }
  //         }
  //       },
  //       select: {
  //         password: false
  //       }
  //     })

  //     return res.status(202).json(user)
  //   } catch (error) {
  //     return serverError(res, error)
  //   }
  // }

  public async loadUser (req: Request, res: Response): Promise<Response> {
    try {
      const user = await prismaClient.user.findUnique({
        where: {
          id: req.userId
        },
        include: {
          cart: true
        }
      })
      delete user.password

      return success(res, user)
    } catch (error) {
      return serverError(res, error)
    }
  }
}
