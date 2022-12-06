import express from 'express'
import cors from 'cors'

class App {
  public readonly express: express.Application

  constructor () {
    this.express = express()
    this.middlewares()
  }

  middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
  }
}

export default new App().express
