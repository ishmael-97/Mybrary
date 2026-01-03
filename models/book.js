const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'

// Schema: (In: MongoDB or noSQL Libraries) A table in a normal SQL database
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        // reference the Id of the author object
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

// For direct path to where the coverImage us uploaded
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

// Export the Schema (Now this model can be imported in the rest of our application and use it to create authors)
module.exports = mongoose.model('Author', authorSchema)

// Export as name variable
module.exports.coverImageBasePath = coverImageBasePath