
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')


app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// Logger
app.use(morgan('tiny'))
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



// API
app.get('/api/persons', (request, response) => Person.find({}).then(people => response.json(people)))

app.get('/api/info', (request, response) => Person.countDocuments().then(r => response.send(`<p>Phonebook has info for ${r} people</p><p>${new Date()}</p>`)))

app.get('/api/persons/:id', (request, response, next) =>
    Person.findById(request.params.id).then(person => {(person) ? response.send(person) : response.status(404).end()}).catch(error => next(error)
))

app.get('/api/persons/:name', (request, response, next) =>
    Person.find({ name: request.params.name }).then(person => {(person) ? response.send(person) : response.status(404).end()}).catch(error => next(error)
))

app.post('/api/persons', (request, response, next) => {

    let body = request.body;
    console.log(body)
    if (!body.name || !body.number) {
       return response.status(400).json( {
           error: 'content missing'
       })
    }

    let newPerson = new Person({
        name: body.name,
        number: body.number
    })

     newPerson.save().then(np => {
        response.json(np)
    }).catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedPerson => {response.json(updatedPerson)}).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(() => {response.status(204).end()}).catch(error => next(error))
})



// Error handling middlewares
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
    next(error)
  }
app.use(errorHandler)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Phonebook backend listening in port ${PORT}`)
})