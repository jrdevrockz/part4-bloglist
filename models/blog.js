const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [5, "title should be atleast 5 chars long"],
    required: [true, "title required"]
  },
  author: {
    type: String,
    required: [true, "author required"]
  },
  url: {
    type: String,
    required: [true, "url required"]
  },
  likes: {
    type: Number,
    default: 0
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)