import { Request, Response } from 'express'

import prismaClient from '../prisma/index'
import { serverError, success } from '../helpers/response-status'

export default class Products {
  public async getProducts (req: Request, res: Response): Promise<Response> {
    try {
      const products = await prismaClient.product.findMany({})

      return success(res, products)
    } catch (error) {
      return serverError(res, error)
    }
  }
}
