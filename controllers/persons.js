const personsRouter = require('express').Router()
const Person = require('./models/person')

//fetching all contacts to our phonebook via a get request
personsRouter.get('/api/contacts', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})
//fetching info contact to our phonebook via a get request

personsRouter.get('/api/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        let taille = persons.length
        response.send(`${date}<br/>There are ${taille} contacts in our phonebook`)
    })


})

//fetching single contact info to our phonebook via get request
personsRouter.get('/api/contacts/:id', (request, response, next) => {
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

personsRouter.delete('/api/contacts/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(person => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
//sending data to our phonebook via post request
personsRouter.post('/api/contacts/', (request, response) => {
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

module.exports = personsRouter
