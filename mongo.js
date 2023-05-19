const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://biroue10:${password}@cluster0.z8qsr8z.mongodb.net/PHONEBOOK2?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)
//Code that create new person to our phonebook
const person = new Person({
    name: 'BIROUE ISAAC',
    number: '0690012381',
})
//Code that fetch data to our database

Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
})
//Code that save new contact to our database and close it
person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
})