const controller = {}

controller.pageNotFound = (req, res) => {
  res.render('error/404')
}

controller.serverError = (req, res) => {
  res.render('error/500')
}

module.exports = controller
