import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import summaryAPI from './api/summary'

const start = (options) => {
  return new Promise((resolve, reject) => {
    // let's init a express app, and add some middlewares
    const app = express()
    app.use(morgan('dev'))
    app.use(helmet())
    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong!, err:' + err))
      res.status(500).send('Something went wrong!')
    })

    // we add our API's to the express app
    summaryAPI(app)

    // finally we start the server, and return the newly created server 
    const server = app.listen(options.port, () => resolve(server))
  })
}

export default start