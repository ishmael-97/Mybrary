const express = require('express')
// Get router from Express
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Books Route
router.get('/',  async (req, res) => {
    // Search Query (complex)
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        // lte = less than or equal to!
        query = query.lte('publishedBefore', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        // gte = greater than or equal to!
        query = query.gte('publishedAfter', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Route: Creating Book (Recall from REST API: USE POST for Creation)
// USED send: We send information to alert about the new creation
router.post('/', upload.single('cover'), async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        res.redirect('books/${newBook.id}')
    } catch {
        // response, existing book, and true (There exists an error)
        renderNewPage(res, book, true)
    }
// })
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

// Show Book Router
router.get('/:id', async (req, res) => {
    try {
        // We fetch the author id, AND further populate the author object by the author information (date, page count, description)
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book})
    } catch {
        res.redirect('/')
    }
})

// Edit Book Route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
})

// Update Book Route
router.put('/:id', upload.single('cover'), async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate) 
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        // Since we don't want to delete sensitive information 
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        }
        // then save the book
        await book.save()
        // After save redirect
        res.redirect('/books/${book.id}')
    } catch {
        // response, existing book, and true (There exists an error)
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            // That is if there was no book at all
            redirect('/')
        }
    }
})

// Delete button functionality (Must delete the user) / Delete Book Page
router.delete('/:id', async (req, res) => {
    let book 
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if (book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})

// New Page 
async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

// Edit Page
async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

// Form Page Handles both new AND edit Pages
async function renderFormPage(res, book, hasError = false) {
     try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book'
            } else {
                // for form == new (Creating a Book)
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render('books/${form}', params)
    } catch {
        res.redirect('/books')
    }
}

// Replaces removeCover (supported by filepond)
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

// Export information to the server (Server must get information from indexRouter)
module.exports = router