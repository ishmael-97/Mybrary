// NOTE: This is the most important component of the MVC 
// This is the Controller -> Routes
const express = require('express')
// Get router from Express
const router = express.Router()
const  Author = require('../models/author')
const Book = require('../models/book')

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
        res.redirect('author/${newAuthor.id}')
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

// Show list of Authors
router.get('/:id', async  (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id}).limi(6).exec()
        res.render('/authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        // NOTE FOR DEBUGING PURPOSES:
        // catch(err){console.log(err) res.redirect('/')}
        res.redirect('/')
    }
    res.send('Show Author' + req.params.id)
})

// Edit Authors
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
})

// Update Authors
router.put('/:id', async (req, res) => {
    // To use varibale inside a catch, Must define outside Try/Catch
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect('/author/${author.id}')
    } catch {
        // If To Account: Case where Author Was Not Found At All
        if (author == null) {
            res.redirect('/')
        } else {
                res.render('author/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

// Delete Author
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        // Removes Author from the database
        await author.remove()
        res.redirect('/authors')
    } catch {
        // If To Account: Case where Author Was Not Found At All
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect('/author/${author.id}')
        }
    }
})

// Export information to the server (Server must get information from indexRouter)
module.exports = router