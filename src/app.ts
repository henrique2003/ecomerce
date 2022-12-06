import express from 'express'

class App {
  public readonly express: express.Application

  constructor () {
    this.express = express()
    this.middlewares()
  }

  middlewares (): void {
    this.express.use(express.json())
  }
}

export default new App().express
