const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}



const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url =`mongodb+srv://admin:${password}@cluster0.n9saw.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,

})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${name}`,
  number: `${number}`
})




if (process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log('phonebook:')
        let people = persons.map(p => p.name + ' ' + p.number);
        people.forEach(person => console.log(person))
        mongoose.connection.close()
    })
}

if (process.argv.length > 3) {
    person.save().then(()  => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
}

