require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
app.use(morgan('tiny'))
app.use(express.static('build'))
app.use(express.json())
const cors = require('cors')
app.use(cors())


//fetching all contacts to our phonebook via a get request
app.get('/api/contacts', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})
//fetching single contact info to our phonebook via get request
app.get('/api/contacts/:id', (request, response) => {
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

app.delete('/api/contacts/:id', (request, response) => {
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

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

//Error handler declaration

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
//use of error handler middleware
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
