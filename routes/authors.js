const express = require('express')
// Get router from Express
const router = express.Router()
const  Author = require('../models/author')

// All authors Route
router.get('/',  async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '' ) {
        // Make sure Case insensitive
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find({})
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.render('/')
    }
})

// New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author()})
})

// Route: Creating Author (Recall from REST API: USE POST for Creation)
// USED send: We send information to alert about the new creation
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        //res-redirect('author/${newAuthor.id}')
        res.redirect('authors')
    } catch {
        res.render('author/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('author/new', {
    //             author: author,
    //             errorMessage: 'Error creating Author'
    //         })
    //     } else {
    //         // res-redirect('author/${newAuthor.id}')
    //         res.redirect('authors')
    //     }
    // })
})

// Export information to the server (Server must get information from indexRouter)
module.exports = router