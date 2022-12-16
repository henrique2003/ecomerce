import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import routes from './app/routes'

class App {
  public readonly express: express.Application

  constructor () {
    this.express = express()
    this.middlewares()
  }

  middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use('/api', routes)
    this.express.use(express.static('public'))
  }
}

export default new App().express
