const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




let phoneBook = [
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


app.get('/api/persons', (request, response) => response.json(phoneBook))

app.get('/api/info', (request, response) => response.send(`<p>Phonebook has info for ${phoneBook.length} people</p><p>${new Date()}</p>`))

app.get('/api/persons/:id', (request, response) => {
    const person = phoneBook.find(p => p.id === Number(request.params.id))
    person ? response.send(person) : response.status(404).end()
})


app.post('/api/persons', (request, response) => {

    let body = request.body;
    console.log(request.body)
    if (!body.name || !body.number) {
       
       return response.status(400).json( {
           error: 'content missing'
       })
    }

    if (phoneBook.find(p => p.name === body.name)) {
        return response.status(400).json( {
            error: 'name must be unique'
        })
     }

    let newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    phoneBook = phoneBook.concat(newPerson)
    response.json(newPerson)
})




app.delete('/api/persons/:id', (request, response) => {
    const person = phoneBook.find(p => p.id === Number(request.params.id))
    if (person) {
        phoneBook = phoneBook.filter(p => person.id !== p.id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})













let generateId = () => {

    let phoneBookLength = phoneBook.length;
    let maxId = Math.random(phoneBookLength + 1, 10000 )

    if (phoneBookLength = 0 ) {
        maxId = 0
    } 
    return maxId;
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Phonebook backend listening in port ${PORT}`)
})