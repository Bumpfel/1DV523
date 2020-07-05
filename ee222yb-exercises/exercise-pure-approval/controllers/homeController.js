const PureNumber = require('../models/purenumber')

const controller = {}

controller.HomePageGet = async (req, res) => {
  const locals = {
    numbers: await PureNumber.find({}),
    flash: req.session.flash
  }

  res.render('home/index', { locals })
  delete req.session.flash
}

controller.NumberPageGet = (req, res) => {
  res.render('home/createNumber', { locals: { flash: req.session.flash } })
  delete req.session.flash
}

controller.NumberPagePost = async (req, res) => {
  try {
    await PureNumber.create({
      value: req.body.numberValue
    })
  } catch (err) {
    req.session.flash = { type: 'errorMsg', msg: err.message }
    res.redirect('/createNumber')
    return
  }
  req.session.flash = { type: 'successMsg', msg: 'Pure number saved successfully.' }
  res.redirect('/')
}

module.exports = controller
