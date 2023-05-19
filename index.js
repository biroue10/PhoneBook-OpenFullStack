require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('build'))
const cors = require('cors')
app.use(cors())

//fetching all contacts to our phonebook via a get request
app.get('/api/contacts', (request, response) => {
    Person.find({}).then(persons => {
        if (persons) {
            response.json(persons)
        }
        else {
            response.status(404).end()
        }
    })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })

})
//fetching single contact info to our phonebook via get request
app.get('/api/contacts/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
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
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
