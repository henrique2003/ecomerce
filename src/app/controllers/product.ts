import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import prismaClient from '../prisma/index'
import { serverError, success, createSuccess } from '../helpers/response-status'

export default class Products {
  public async get (req: Request, res: Response): Promise<Response> {
    try {
      const products = await prismaClient.product.findMany()

      return success(res, products)
    } catch (error) {
      return serverError(res, error)
    }
  }

  public async create (req: Request, res: Response): Promise<Response> {
    try {
      const { title, cost, type } = req.body

      const product = await prismaClient.product.create({
        data: {
          id: uuidv4(),
          cost,
          title,
          type
        }
      })

      return createSuccess(res, product)
    } catch (error) {
      console.log(error.message)

      return serverError(res, error)
    }
  }
}
