'use strict'

const express = require('express')
const nunjucks = require('nunjucks')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const methodOverride = require('method-override')
const dataJ = require('../data/data.json')

const app = express()

// Set view engine
app.set('view engine', 'njk')

// Body Parser middleware
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(methodOverride('_method'))
app.use(morgan('dev'))

// Set static Path
app.use(express.static(path.join(__dirname, 'public')))

// View engine configuration
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    autoescape: true,
    noCache: true
})

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Members Webserver App'
    })
})

app.get('/Members', (req, res) => {
    res.render('index', {
        members: dataJ.members
    })
})

app.get('/form', (req, res) => {
    res.render('formulaire')
})

app.get('/new_member', (req, res) => {
    dataJ.members
    res.render('new')
})

const idFilter = req => member => member.id === parseInt(req.params.id)
const dataPath = './data/data.json'

// helper methods
const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = 'utf8'
) => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            throw err
        }

        callback(returnJson ? JSON.parse(data) : data)
    })
}

const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, err => {
        if (err) {
            throw err
        }

        callback()
    })
}

// first_test routes
app.get('/first_test', (req, res) => {
    res.json({message : 'My firt test pass!'})
})

// Create Member
app.post('/members', (req, res) => {
    readFile(data => {

        const newMember = {
            id: data.members.length + 1,
            name: req.body.name,
            age: req.body.age,
        }
        if (!newMember.name || !newMember.age) {
            return res.status(400).json({msg: 'Please include a name and age'})
        }

        data.members.push(newMember)

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send('new member added')
        })
    }, true)
})

/*
app.get('/members', (req, res) => {
    readFile(data => {
        res.send(data)
    }, true)
})
*/
// Get Single Member
app.get('/members/:id', (req, res) => {
    readFile(data => {
        const found = data.members.some(idFilter(req))
        if (found) {
            res.json(data.members.filter(idFilter(req)))
        } else {
            res.status(400).json({msg: `No member with the id: ${req.params.id}`})
        }
    }, true)
})

// Update Member
app.put('/members/:id', (req, res) => {
    readFile(data => {

        const found = data.members.some(idFilter(req))
        if (found) {
            data.members.forEach((member, i) => {

                if (idFilter(req)(member)) {
                    const updMember = {...member, ...req.body}
                    data.members[i] = updMember

                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).json({msg: `member with id: ${req.params.id} updated`})
                    })
                }
            })
        } else {
            res.status(400).json({msg: `No member with the id: ${req.params.id}`})
        }
    }, true)
})

// Delete Member
app.delete('/members/:id', (req, res) => {

    readFile(data => {
        const found = data.members.some(idFilter(req))
        if (found) {
            data.members.forEach((member, i) => {
                if (idFilter(req)(member)) {
                    delete data.members[i]
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).json({msg: `Member with id: ${req.params.id} deleted`})
                    })
                }
            })
        } else {
            res.status(400).json({msg: `No member with the id: ${req.params.id}`})
        }
    }, true)
})

module.exports = app