
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


//fetching all contacts to our phonebook via a get request
app.get('/api/contacts', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})
//fetching info contact to our phonebook via a get request

app.get('/api/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        let taille = persons.length
        response.send(`${date}<br/>There are ${taille} contacts in our phonebook`)
    })


})

//fetching single contact info to our phonebook via get request
app.get('/api/contacts/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})
//deleting contact to our phonebook via delete request

app.delete('/api/contacts/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(person => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
//sending data to our phonebook via post request
app.post('/api/contacts/', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedperson => {
        response.json(savedperson)
    })
})
// handler of requests with unknown endpoint
app.use(unknownEndpoint)
//use of error handler middleware
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
