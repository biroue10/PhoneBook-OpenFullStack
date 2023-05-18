const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(morgan('tiny'))
app.use(express.json())
const cors = require('cors')
app.use(cors())


let contacts = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

//fetching all contacts to our phonebook via a get request
app.get('/api/contacts', (request, response) => {
    response.json(contacts)

})
//fetching date and number of contacts in our phonebook via a get request
app.get('/api/info', (request, response) => {
    let contact_length = contacts.length
    let date = new Date()
    response.send(`Phonebook has info for ${contact_length} peoples <p>${date}</p>`)

})
//fetching single contact info to our phonebook via get request
app.get('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})
//deleting contact to our phonebook via delete request

app.delete('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
})
//sending data to our phonebook via post request
app.post('/api/contacts/', (request, response) => {
    const contact = {
        id: Math.floor(Math.random(100) * 100),
        name: request.body.name,
        number: request.body.number,
    }
    if (request.body.name === '' || request.body.number === '') {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const existingContact = contacts.find((contact) => contact.name === request.body.name)
    if (existingContact) {
        return response.status(400).json({
            error: 'name must be unique',
        });
    }
    else {
        contacts = contacts.concat(contact)
        response.json(contact)
    }
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})