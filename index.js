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
        response.json(persons)
    })

})
//fetching date and number of contacts in our phonebook via a get request
app.get('/api/info', (request, response) => {
    let contact_length = contacts.length
    let date = new Date()
    response.send(`Phonebook has info for ${contact_length} peoples <p>${date}</p>`)

})
//fetching single contact info to our phonebook via get request
app.get('/api/contacts/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})
//deleting contact to our phonebook via delete request

app.delete('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
})
//sending data to our phonebook via post request
app.post('/api/contacts/', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
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
