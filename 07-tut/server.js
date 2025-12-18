const path = require('path')
const logEvents = require('./middleware/logEvents')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3500

//custom middleware for logging
app.use((req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`)
    next()
})


// built in middleware to handle url encoded data
// in other words: form data:
// content-type: applications/x-www-form-urlencoded

app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json())

// built in middleware for static files

app.use(express.static(path.join(__dirname, '/public')))

app.get(/^\/$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get(/^\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get(/^\/new-page(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get(/^\/old-page(\.html)?$/, (req, res) => {
    res.redirect(301, '/new-page.html')
})

app.get(/^\/hello(\.html)?$/, (req, res, next) => {
    console.log('attempted to load hello.html')
    next()
}, (req, res) => {
    res.send('Hello World!')
})

// chaining route handlers

const one = (req, res, next)=>{
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()

}

const three = (req, res) => {
    console.log('three')
    res.send('Finished')
}

app.get(/^\/chain(\.html)?$/, [one, two, three])

app.get(/\/*/, (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT, () => {console.log(`Server running on Port ${PORT}`)})