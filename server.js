if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

// Server Must know that the router in index.js exists (import the router into our server, / route of our app ./ relative to the route of app)
const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

// Connect Our Server To The Database (MongoDB)
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error) )
db.once('open', () => console.log('Connected to Mongoose'))

// Tell app to use reference to the indexRouter
app.use('/', indexRouter)

// Server must listen
app.listen(process.env.PORT || 3000)

// USED: MVC to layout the app
// Controler -> Routes folder (node js norm to use routes instead of controler)
// Views folder: All the views from MVC are going to go!
// Models: This is where All of our database models are going to go!