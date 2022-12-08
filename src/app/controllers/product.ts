import { Request, Response } from 'express'

import prismaClient from '../prisma/index'
import { serverError, success } from '../helpers/response-status'

export default class Products {
  public async get (req: Request, res: Response): Promise<Response> {
    try {
      const products = await prismaClient.product.findMany({})

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
          cost,
          title,
          type
        }
      })

      return res.status(201).json(product)
    } catch (error) {
      return serverError(res, error)
    }
  }
}
