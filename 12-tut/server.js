require('dotenv').config()
const path = require('path')
const cors = require('cors')
const { corsOptions } = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3500
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')


//custom middleware for logging
app.use(logger)

//Cross Origin Resource Sharing
app.use(cors(corsOptions))

// built in middleware to handle url encoded data
// in other words: form data:
// content-type: applications/x-www-form-urlencoded

app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

// built in middleware for serving static files like CSS, images, etc
app.use(express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

app.use(verifyJWT) //protect all routes after this middleware
app.use('/employees', require('./routes/api/employees'))


app.all(/^.$/, (req, res) => {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
        
    }else if (req.accepts('json')){
        res.json({error: "404 Not Found"})

    }else{
        res.type('txt').send("404 Not Found")
    }
})

app.use(errorHandler)

app.listen(PORT, () => {console.log(`Server running on Port ${PORT}`)})