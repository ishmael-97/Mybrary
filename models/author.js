const mongoose = require('mongoose')
// Schema: (In: MongoDB or noSQL Libraries) A table in a normal SQL database
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Export the Schema (Now this model can be imported in the rest of our application and use it to create authors)
module.exports = mongoose.model('Author', authorSchema)