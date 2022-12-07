import { Router } from 'express'

import Products from './controllers/product'
import User from './controllers/user'

const routes = Router()

const products = new Products()
const user = new User()

// Products
routes.get('/products', products.getProducts)

// User
routes.post('/user', user.register)

export default routes
