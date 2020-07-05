/**
 * Tells whether user is authorized and has a session saved on the server
 * @param {*} session
 * @returns boolean
 */
const isLoggedIn = session => {
  return session.userId !== undefined
}

/**
 * Sets successful msg to display to client in a session variable
 * @param {*} session
 * @param {string} msg
 */
const setFlashSuccessMsg = (session, msg) => {
  setFlashMsg(session, msg, 'successMsg')
}

/**
 * Sets error msg to display to client in a session variable
 * @param {*} session
 * @param {string} msg
 */
const setFlashErrorMsg = (session, msg) => {
  setFlashMsg(session, msg, 'errorMsg')
}

/**
 * Used internally by setFlashSuccessMsg, and setFlashErrorMsg
 */
const setFlashMsg = (session, _msg, _type) => {
  session.flash = { type: _type, msg: _msg }
}

/**
 * Function used to set variables used by the handlebars files
 * @param {Request} req
 */
const setLocals = req => {
  const locals = {
    username: req.session.username,
    flash: req.session.flash,
    isLoggedIn: isLoggedIn(req.session),
    // searchString: req.query.searchString || req.session.searchString,
    searchType: req.query.type || req.session.searchType // save chosen search type in session so the select dropdown doesn't reset upon loading a new page
  }

  return locals
}

module.exports = { setLocals, setFlashErrorMsg, setFlashSuccessMsg, isLoggedIn }
