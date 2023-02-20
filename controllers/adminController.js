/* eslint-disable no-undef */
const { ObjectId } = require('mongodb')
const { Category } = require('../model/category')
const { Product } = require('../model/product')
const { User } = require('../model/users')
const Order = require('../model/order')
const Coupon = require('../model/coupon')
const puppeteer = require('puppeteer')
const xlsx = require('xlsx')

module.exports = {
  getAdminLogin: async (req, res) => {
    res.locals.prelogin = true
    res.render('adminLogin')
  },
  getAdminHome: async (req, res) => {
    try {
      let totalIncome
      const result = await Order.aggregate([
        { $match: { isDelivered: true } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
      if (result.length === 0) {
        totalIncome = 0
      } else {
        totalIncome = await result[0].total
      }
      const totalCustomer = await User.countDocuments()
      const totalProduct = await Product.countDocuments()
      const totalOrder = await Order.countDocuments()
      console.log(totalProduct)
      res.render('adminHome', { totalIncome, totalCustomer, totalProduct, totalOrder })
    } catch (e) {
      console.log(e)
    }
  },
  getAdminUser: async (req, res) => {
    try {
      const users = await User.find()
      return res.render('adminUsers', { users })
    } catch (err) {
      console.log(err)
    }
  },

  getAdminCategory: async (req, res) => {
    try {
      const categoryList = await Category.find()
      res.render('adminCategory', { categoryList })
    } catch (e) {
      console.log(e)
      res.render('adminCategory')
    }
  },

  getAddCategory: (req, res) => {
    try {
      if (req.session.message) {
        const message = req.session.message
        req.session.message = null
        res.render('adminAddCategory', { message })
      } else {
        res.render('adminAddCategory')
      }
    } catch (e) {
      console.log(e)
    }
  },

  getAdminProduct: async (req, res) => {
    console.log('getAdminProduct listing')
    const productList = await Product.find().populate('category')
    if (!productList) {
      res.status(500).json({ success: false })
    }
    res.render('adminProducts', { productList })
  },
  getAddProducts: async (req, res) => {
    try {
      const category = await Category.find()
      if (req.session.message) {
        const message = req.session.message
        req.session.message = null
        res.render('adminAddproducts', { category, message })
      } else {
        res.render('adminAddproducts', { category })
      }
    } catch (e) {
      console.log(e)
    }
  },
  getUpdateProduct: async (req, res) => {
    try {
      console.log('getUpdateProduct')
      if (req.session.message) {
        const id = req.params._id
        const product = await Product.findById(id).populate('category')
        const categories = await Category.find()
        const message = req.session.message
        req.session.message = null
        res.render('adminUpdateProducts', { categories, product, message })
      } else {
        const id = req.params._id
        const product = await Product.findById(id).populate('category')
        const categories = await Category.find()
        res.render('adminUpdateProducts', { categories, product })
      }
    } catch (e) {
      res.render('adminUpdateProducts', { message: e })
    }
  },

  // admin orders page
  getAdminOrder: async (req, res) => {
    console.log('admin-order works!!')
    const orders = await Order.find({}).populate('user').sort({ createdAt: -1 })
    const ordersV = await Order.find().populate('orderItems.id').sort({ createdAt: -1 })
    const allOrderItems = []
    for (let i = 0; i < ordersV.length; i++) {
      const doc = ordersV[i]
      allOrderItems.push(doc)
    }
    const orderItemsArray = allOrderItems.map(allOrderItem => allOrderItem.orderItems)
    const arr = []
    for (let i = 0; i <= orderItemsArray.length; i++) {
      arr.push(orderItemsArray[i])
    }
    res.render('adminOrders', { order: orders, arrs: arr })
  },

  deliverOrder: async (req, res) => {
    console.log('deliver order works!')
    try {
      const orderId = await req.params._id
      console.log('deliver ' + orderId)
      const order = await Order.find({ _id: orderId })
      order[0].isCancelled = false
      order[0].isDelivered = true
      order[0].version++
      await order[0].save()

      const orderAggr = await Order.aggregate([
        { $match: { _id: ObjectId(orderId) } },
        { $unwind: '$orderItems' },
        { $lookup: { from: 'products', localField: 'orderItems.id', foreignField: '_id', as: 'results' } },
        { $unwind: '$results' },
        { $addFields: { 'results.quantity': '$orderItems.quantity' } },
        { $group: { _id: '$_id', orderItems: { $push: '$results' } } }
      ])
      const arr = orderAggr[0].orderItems.flat()
      console.log(arr)
      if (order[0].version !== 0) {
        for (const item of arr) {
          const product = await Product.findById(item._id)
          product.stock -= item.quantity
          if (product.stock === 0) {
            product.isBlocked = true
          }
          await product.save()
        }
      }

      res.json({ redirect: '/admin/orders' })
    } catch (err) {
      console.log(err)
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const orderId = req.params._id
      const order = await Order.find({ _id: orderId })
      order[0].isCancelled = true
      order[0].isDelivered = false
      if (order[0].version >= 1) {
        order[0].cancelVersion++
      }
      await order[0].save()

      const orderAggr = await Order.aggregate([
        { $match: { _id: ObjectId(orderId) } },
        { $unwind: '$orderItems' },
        { $lookup: { from: 'products', localField: 'orderItems.id', foreignField: '_id', as: 'results' } },
        { $unwind: '$results' },
        { $addFields: { 'results.quantity': '$orderItems.quantity' } },
        { $group: { _id: '$_id', orderItems: { $push: '$results' } } }
      ])
      const arr = orderAggr[0].orderItems.flat()
      console.log(arr)

      if (order[0].version !== 0 && order[0].cancelVersion !== 0) {
        for (const item of arr) {
          const product = await Product.findById(item._id)
          product.stock += item.quantity
          if (product.stock !== 0) {
            product.isBlocked = false
          }
          await product.save()
        }
      }

      res.json({ redirect: '/admin/orders' })
    } catch (err) {
      console.log(err)
    }
  },

  returnOrder: async (req, res) => {
    console.log('return order works!')
    try {
      const orderId = req.params._id
      await Order.find({ _id: orderId })
      await Order.findOneAndUpdate({ _id: orderId }, { isReturnStatus: true })

      const orderAggr = await Order.aggregate([
        { $match: { _id: ObjectId(orderId) } },
        { $unwind: '$orderItems' },
        { $lookup: { from: 'products', localField: 'orderItems.id', foreignField: '_id', as: 'results' } },
        { $unwind: '$results' },
        { $addFields: { 'results.quantity': '$orderItems.quantity' } },
        { $group: { _id: '$_id', orderItems: { $push: '$results' } } }
      ])
      const arr = orderAggr[0].orderItems.flat()
      console.log(arr)

      for (const item of arr) {
        const product = await Product.findById(item._id)
        product.stock += item.quantity
        if (product.stock !== 0) {
          product.isBlocked = false
        }
        await product.save()
      }

      res.json({ redirect: '/admin/orders' })
    } catch (err) {
      console.log(err)
    }
  },

  viewAdminOrder: async (req, res) => {
    const id = req.params._id
    console.log(id)

    const order = await Order.aggregate([
      { $match: { _id: ObjectId(id) } },
      { $unwind: '$orderItems' },
      { $lookup: { from: 'products', localField: 'orderItems.id', foreignField: '_id', as: 'results' } },
      { $unwind: '$results' },
      { $lookup: { from: 'categories', localField: 'results.category', foreignField: '_id', as: 'results.category' } },
      { $addFields: { 'results.quantity': '$orderItems.quantity' } },
      { $group: { _id: '$_id', orderItems: { $push: '$results' } } }
    ])
    const arr = await order[0].orderItems.flat()
    console.log(arr)

    res.render('viewAdminOrder', { arr })
  },

  // -------------------------------

  // for chart
  getchartData: async (req, res, next) => {
    console.log('getchartData controller works')
    try {
      const productWiseSale = await Order.aggregate(
        [
          {
            $lookup: {
              from: 'products',
              localField: 'orderItems.id',
              foreignField: '_id',
              as: 'test'
            }
          }, {
            $unwind: {
              path: '$test'
            }
          }, {
            $group: {
              _id: '$test.name',
              totalAmount: {
                $sum: '$totalAmount'
              }
            }
          }
        ]
      )

      console.log(productWiseSale)
      return res.json({ productWiseSale })
    } catch (err) {
      console.log(err)
    }
  },
  showChart: (req, res) => {
    res.render('adminChart')
  },
  getSales: async (req, res) => {
    const result = await Order.aggregate([
      { $match: { isDelivered: true } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    if (result.length === 0) {
      totalIncome = 0
    } else {
      totalIncome = await result[0].total
    }
    const totalCustomer = await User.countDocuments()
    const totalProduct = await Product.countDocuments()
    const totalOrder = await Order.countDocuments()
    res.render('adminSales', { totalIncome, totalCustomer, totalProduct, totalOrder })
  },
  // --------------------------------------------------------//
  LoginAdmin: (req, res) => {
    req.session.admin = true
    return res.redirect('/admin/home')
  },
  blockUser: async (req, res) => {
    console.log('007')
    const id = req.params._id
    const user = await User.findById(id)
    console.log(id)
    console.log(user._id)
    console.log(req.session.user)
    if (user.isBlocked) {
      try {
        await User.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: false
          }
        })
        return res.json({
          redirect: '/admin/users'
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await User.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: true
          }
        })
        if (req.session.user._id === id) {
          req.session.auth = null
          req.session.email = null
          req.session.user = null
        }
        return res.json({
          redirect: '/admin/users'
        })
      } catch (error) {
      }
    }
  },
  LogoutAdmin: (req, res) => {
    req.session.admin = null
    res.redirect('/admin/login')
  },
  // ----------------------------------------------------------------//
  addCategory: async (req, res) => {
    try {
      const category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
      })
      await category.save()
      res.redirect('/admin/category')
    } catch (e) {
      console.log(e)
      const index = e.message.indexOf('name:') + 6
      const message = e.message.substring(index)
      if (e.code === 11000) {
        req.session.message = 'Category Name already exists'
      } else {
        req.session.message = message
      }
      res.redirect('/admin/addcategory')
    }
  },

  deleteCategory: async (req, res) => {
    console.log('1')
    const id = req.params._id
    const category = await Category.findById(id)
    console.log(id)
    console.log(category)
    if (category.isBlocked) {
      try {
        await Category.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: false
          }
        })
        return res.json({
          redirect: '/admin/category'
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await Category.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: true
          }
        })
        return res.json({
          redirect: '/admin/category'
        })
      } catch (error) {
      }
    }
  },
  // --------------------------------------------------------------//
  addProduct: async (req, res) => {
    try {
      const category = await Category.findById(req.body.category)
      console.log(category)
      if (!category) return res.status(400).send('Invalid Category')

      const fileName = await req.file.filename
      console.log(fileName)
      const basePath = `${req.protocol}://${req.get('host')}/uploads/`
      let product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: `${basePath}${fileName}`,
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock
      })

      product = await product.save()

      if (!product) { return res.status(500).send('The product cannot be created') }
      res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
      const index = e.message.indexOf('Error:')
      const message = e.message.substring(index)
      if (e.code === 11000) {
        req.session.message = 'Product Name already exists'
      } else {
        req.session.message = message
      }
      res.redirect('/admin/addproduct')
    }
  },

  editProduct: async (req, res) => {
    try {
      const basePath = `${req.protocol}://${req.get('host')}/uploads/`
      const fileName = await req.file.filename
      const img = `${basePath}${fileName}`
      const id = await req.params._id
      console.log(id)
      const product = await Product.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          price: req.body.price,
          image: img,
          description: req.body.description,
          category: req.body.category,
          stock: req.body.stock
        },
        { new: true, runValidators: true }
      )
      console.log(product)
      return res.status(200).json({ redirect: '/admin/products/' })
    } catch (e) {
      console.log(e)
      const index = e.message.indexOf('Error:')
      const message = e.message.substring(index)
      if (e.code === 11000) {
        req.session.message = 'Product Name already exists'
      } else if (e.name === 'MongooseError') {
        req.session.message = 'Some error Happened..Please check the fields.'
      } else {
        req.session.message = message
      }
      res.redirect('/admin/updateproduct/')
    }
  },

  deleteProduct: async (req, res) => {
    console.log('007')
    const id = req.params._id
    const product = await Product.findById(id)
    console.log(id)
    console.log(product)

    if (product.isBlocked) {
      try {
        await Product.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: false
          }
        })
        return res.json({
          redirect: '/admin/products'
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await Product.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: true
          }
        })
        return res.json({
          redirect: '/admin/products'
        })
      } catch (error) {
      }
    }
  },
  // ------------------------------Coupon--------------------------------//
  getcouponDash: async (req, res) => {
    try {
      const coupon = await Coupon.find({})
      res.render('adminCoupon', { coupon })
    } catch (err) {
      console.log(err)
    }
  },

  addCoupons: async (req, res) => {
    return res.render('adminCouponAdd')
  },

  postaddCoupon: async (req, res) => {
    const { couponCode, expiryDate, minDiscountAmount, discountPercentage } = req.body
    try {
      const coupon = await Coupon.create({
        couponCode,
        expiryDate: new Date(expiryDate),
        minDiscountAmount: parseInt(minDiscountAmount),
        discountPercentage: parseInt(discountPercentage),
        isAvailable: true
      })
      console.log(coupon)
      await coupon.save()
      res.redirect('/admin/coupons')
    } catch (err) {
      console.log(err)
    }
  },

  // for blocking unblocking coupon
  updateCoupon: async (req, res) => {
    const id = req.params._id
    try {
      console.log('block works')
      const coupon = await Coupon.findById({ _id: id })
      const isAvailable = coupon.isAvailable
      coupon.isAvailable = !isAvailable
      await coupon.save()
      res.json({ redirect: '/admin/coupons' })
    } catch (e) {
      console.log(e)
    }
  },
  // ----------------------------Sales Report----------------------------------//

  getreportDownload: async (req, res) => {
    try {
      const basePath = req.protocol + '://' + req.hostname + ':' + req.socket.localPort
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      const websiteUrl = `${basePath}/admin/generateTable`
      await page.goto(websiteUrl, { waitUntil: 'networkidle0' })
      await page.emulateMediaType('screen')
      await page.pdf({
        path: 'result.pdf',
        printBackground: true,
        format: 'A4'
      })
      res.download('result.pdf')
      await browser.close()
    } catch (e) {
      console.log(e)
    }
  },

  generateTable: async (req, res) => {
    const productSale = await Order.aggregate(
      [
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.id',
            foreignField: '_id',
            as: 'test'
          }
        }, {
          $unwind: {
            path: '$test'
          }
        }, {
          $group: {
            _id: '$test.name',
            totalAmount: {
              $sum: '$totalAmount'
            }
          }
        }
      ]
    )
    console.log(productSale)
    res.render('productPdf', { productSale })
  },

  excelTable: async (req, res) => {
    const productSale = await Order.aggregate(
      [
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.id',
            foreignField: '_id',
            as: 'test'
          }
        }, {
          $unwind: {
            path: '$test'
          }
        }, {
          $group: {
            _id: '$test.name',
            totalAmount: {
              $sum: '$totalAmount'
            }
          }
        }
      ]
    )
    const saleReport = []
    productSale.forEach(items => {
      excel = {
        Product: items._id,
        TotalAmount: items.totalAmount
      }
      saleReport.push(excel)
    })
    console.log(saleReport)
    const newWB = xlsx.utils.book_new()
    const newWS = xlsx.utils.json_to_sheet(saleReport)
    xlsx.utils.book_append_sheet(newWB, newWS, 'SalesReport')
    xlsx.writeFile(newWB, './public/files/SalesReport.xlsx')
    res.download('./public/files/SalesReport.xlsx', 'salesReport.xlsx')
  },

  getAdminOffers: (req, res) => {
    res.render('adminOffers')
  }
}
