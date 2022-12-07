import { Router } from 'express'

import Products from './controllers/product'

const routes = Router()

const products = new Products()

// Products
routes.get('/products', products.getProducts)

export default routes
