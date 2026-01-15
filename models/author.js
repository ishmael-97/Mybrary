const mongoose = require('mongoose')
const Book = require('./book')
// Schema: (In: MongoDB or noSQL Libraries) A table in a normal SQL database
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// pre: allows us to run a method before a certain action occurs
// parameter next: is callback, if next carries error then code cannot continue to execute
// Purpose_Method: Ensures that an author with books ramaining is not removed
authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id}, (err, books) => {
        if (err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error('This author still has books'))
        } else {
            // Continue to execute code (non of the conditions above held)
            next()
        }
    })
})

// Export the Schema (Now this model can be imported in the rest of our application and use it to create authors)
module.exports = mongoose.model('Author', authorSchema)