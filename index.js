
const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const morgan = require('morgan')
const Person = require('./models/person')
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))
app.use(morgan('tiny'))



// handler of requests with unknown endpoint
app.use(unknownEndpoint)
//use of error handler middleware
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
