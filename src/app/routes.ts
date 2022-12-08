import { Router } from 'express'

import Products from './controllers/product'
import User from './controllers/user'
import { auth } from './middlewares/auth'

const routes = Router()

const products = new Products()
const user = new User()

// Products
routes.get('/products', products.get)
routes.post('/products', products.create)

// User
routes.post('/user/register', user.register)
routes.post('/user/login', user.login)
routes.put('/user/cart/add', auth, user.addProductOnCart)

export default routes
