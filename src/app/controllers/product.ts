import { Request, Response } from 'express'

import prismaClient from '../prisma/index'
import { serverError } from '../helpers/errors'

export default class Products {
  public async getProducts (req: Request, res: Response): Promise<Response> {
    try {
      const products = await prismaClient.product.findMany({})

      return res.status(200).json(products)
    } catch (error) {
      return serverError(res, error)
    }
  }
}
