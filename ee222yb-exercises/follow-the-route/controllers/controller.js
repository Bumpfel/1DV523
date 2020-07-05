const Product = require('../models/product')

const controller = {}

controller.getHomePage = (req, res) => res.sendFile('public/index.html')

controller.postNewProduct = async (req, res) => {
  // try {
  //   const newProduct = new Product({
  //     name: req.body.name,
  //     description: req.body.description,
  //     price: req.body.price
  //   })

  //   await newProduct.save()
  // } catch (error) {
  //   console.error(error)
  //   return
  // }
  await Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  })
    .catch(error => {
      console.error(error)
    })

  res.redirect('/product')
}

controller.getProductsOverview = async (req, res) => {
  const locals = {
    products: (await Product.find({})).map(product => (
      {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        inStock: product.inStock
      }
    ))
  }
  res.render('product/product-overview', { locals })
}

controller.getCreateProduct = (req, res) => {
  res.render('product/create-product')
}

controller.getProductInfo = async (req, res) => {
  const locals = {
    product: await Product.findOne({ _id: req.params.id })
  }
  res.render('product/product-info', { locals })
}

controller.deleteProduct = async (req, res) => {
  await Product.deleteOne({ _id: req.params.id })
    .catch(err => {
      console.log(err)
    })

  res.redirect('/product')
}

module.exports = controller
