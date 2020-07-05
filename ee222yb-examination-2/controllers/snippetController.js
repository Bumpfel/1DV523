'use strict'

const errorController = require('./errorController')
const functions = require('./functions')
const User = require('../models/user')
const Snippet = require('../models/snippet')
const msg = require('../strings/msgs')

const snippetsPerPage = 5

const snippetController = {}

/**
 * Splits a string on spaces and returns an array of the result
 * @param {string} tags
 */
const splitTags = (tags) => {
  tags = new Set(tags.trim().split(' ').filter(tag => tag.trim() !== ''))
  return Array.from(tags)
}

/**
 * Snippet home page (displays snippets) (GET)
 * Filters snippets by search string and type if set
 */
snippetController.index = async (req, res) => {
  req.session.prevUrl = req.url
  req.session.searchType = req.query.t || req.session.searchType
  const locals = functions.setLocals(req)

  // Search filters
  let search
  if (req.query.q) {
    locals.searchString = req.query.q.trim()
    if (req.query.t === 'user') {
      search = { author: { $in: locals.searchString.split(' ') } } // query for snippet matching either author
    } else if (req.query.t === 'tags') {
      search = { tags: { $all: locals.searchString.split(' ') } } // query for snippet matching ALL tags
    } else {
      functions.setFlashErrorMsg(req.session, msg.invalidSeachType)
      res.redirect('/')
      return
    }
  }

  // Pagination
  const allSnippets = await Snippet.find(search)
    .catch(err => {
      console.error(err)
      errorController.serverError(err, req, res)
    })
  locals.nrOfSnippets = allSnippets.length

  locals.snippetsPerPage = snippetsPerPage
  const logicalPage = req.query.page - 1 >= 0
    ? (req.query.page - 1) * snippetsPerPage < locals.nrOfSnippets // is query page <= last page?
      ? req.query.page - 1
      : Math.floor((locals.nrOfSnippets - 1) / snippetsPerPage) // set last page
    : 0 // the page in query was < 0
  locals.currentPage = logicalPage + 1

  // Query
  locals.snippets = await Snippet.find(search).sort().skip(logicalPage * snippetsPerPage).limit(snippetsPerPage)
    .catch(err => {
      console.error(err)
      errorController.serverError(err, req, res)
    })

  if (locals.snippets) {
    // snippet.author = await User.findById(req.session.userId),
    locals.snippets.forEach(snippet => { snippet.belongsToUser = (snippet.authorId === req.session.userId) })
  }
  res.render('snippet/index', locals)
  delete req.session.flash
}

/**
 * Create new snippet page (GET)
 */
snippetController.create = async (req, res) => {
  req.session.prevUrl = req.url
  res.render('snippet/create', functions.setLocals(req))
  delete req.session.flash
}

/**
 * Create snippet (POST) - requires user to be logged in. Expects req.body.content (and req.body.tags (optional))
 */
snippetController.createPost = async (req, res) => {
  req.session.prevUrl = req.url
  const user = await User.findById(req.session.userId)
    .catch(err => {
      console.error(err)
      errorController.serverError(err, req, res)
    })

  if (!user) {
    // client tried to post a new snippet when not logged in
    functions.setFlashErrorMsg(req.session, msg.notLoggedIn)
    errorController.forbidden(req, res)
    return
  }

  const snippet = await Snippet.create({ content: req.body.content, authorId: req.session.userId, tags: splitTags(req.body.tags), author: user.username })
    .catch(err => {
    // snippet validation error (or db error)
      functions.setFlashErrorMsg(req.session, err.message)
      res.redirect('create')
    })

  if (snippet) {
    // snippet created
    functions.setFlashSuccessMsg(req.session, msg.snippetPosted)
    res.redirect('/?page=' + 999 + '#' + snippet._id) // TODO fullösning
  }
}

/**
 * Delete snippet (GET)
 */
snippetController.delete = async (req, res) => {
  const snippet = await Snippet.findOneAndDelete({ _id: req.params.id, authorId: req.session.userId })
    .catch(err => {
      console.error(err)
      errorController.serverError(err, req, res)
    })

  if (snippet) {
    functions.setFlashSuccessMsg(req.session, msg.snippetDeleted)
    res.redirect(req.session.prevUrl)
  } else {
    functions.setFlashErrorMsg(req.session, msg.snippetNotFound) // or does not belong to user
    errorController.forbidden(req, res)
  }
}

/**
 * Edit snippet page (GET). Requires user to be logged in and to be the snippet author.
 * Expects snippet._id as req.params.id
 */
snippetController.edit = async (req, res) => {
  const snippet = await Snippet.findOne({ _id: req.params.id, authorId: req.session.userId }, '_id content tags')

  if (snippet) {
    const locals = functions.setLocals(req)
    locals.snippet = snippet
    locals.snippet.content = req.query.content || locals.snippet.content // sets content to what was previously written (and validation failed) or to real snippet content
    res.render('snippet/edit', locals)
  } else {
    functions.setFlashErrorMsg(req.session, msg.notLoggedIn)
    errorController.forbidden(req, res)
  }
  delete req.session.flash
}

/**
 * Edit snippet (POST) - Requires user to be logged in and author of the snippet
 * Expects req.body.content and req.body.tags (optional)
 */
snippetController.editPost = async (req, res) => {
  if (!functions.isLoggedIn(req.session)) {
    functions.setFlashErrorMsg(req.session, msg.notLoggedIn)
    errorController.forbidden(req, res)
    return
  }

  try {
    Snippet.validateContent(req.body.content)
  } catch (err) {
    functions.setFlashErrorMsg(req.session, err.message)
    res.redirect(req.url + '?content=' + req.body.content)
    return
  }

  const snippet = await Snippet.findOneAndUpdate({ _id: req.params.id, authorId: req.session.userId }, { content: req.body.content, tags: splitTags(req.body.tags) })
    .catch(err => {
      console.error(err)
      errorController.serverError(err, req, res)
    })

  if (snippet) {
    functions.setFlashSuccessMsg(req.session, msg.snippetEdited)
    res.redirect(req.session.prevUrl + '#' + snippet._id)
  } else {
    functions.setFlashErrorMsg(req.session, msg.notLoggedIn)
    errorController.forbidden(req, res)
  }
}

module.exports = snippetController
