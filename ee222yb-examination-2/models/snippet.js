'use strict'

const mongoose = require('mongoose')

const minContent = 4
const maxContent = 1000

const snippetSchema = new mongoose.Schema({
  content: { type: String, required: true, minlength: minContent, maxlength: maxContent },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  tags: { type: Array }
}, { timestamps: true })

snippetSchema.path('content').validate(content => {
  return content.length >= minContent && content.length <= 1000
}, 'Content must be between ' + minContent + ' and ' + maxContent + ' characters long')

snippetSchema.methods.isEdited = function () {
  return this.createdAt.getTime() !== this.updatedAt.getTime()
}

snippetSchema.statics.validateContent = function (content) { // used when editing
  if (content.length >= minContent && content.length <= maxContent) {
    return true
  }
  throw new Error('Content must be between ' + minContent + ' and ' + maxContent + ' characters long')
}

module.exports = mongoose.model('Snippet', snippetSchema)
