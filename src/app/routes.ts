import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  res.send('Hellow world')
})

export default routes
