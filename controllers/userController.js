/* eslint-disable eqeqeq */
const { ObjectId } = require('mongodb')
const { Category } = require('../model/category')
const { User } = require('../model/users')
const { Product } = require('../model/product')
const Order = require('../model/order')
const Coupon = require('../model/coupon')
const Razorpay = require('razorpay')
const bcrypt = require('bcrypt')
const axios = require('axios')
require('dotenv').config()

module.exports = {
  getHomepage: async (req, res) => {
    const product = await Product.find()
    return res.render('home-page', { product })
  },

  getRegister: (req, res) => {
    if (req.session.message) {
      const message = req.session.message
      req.session.message = null
      return res.render('register', { message })
    } else {
      const message = ''
      return res.render('register', { message })
    }
  },

  getRegisterOtp: (req, res) => {
    return res.render('register-otp')
  },

  getLogin: (req, res) => {
    if (req.session.message) {
      const message = req.session.message
      req.session.message = null
      return res.render('login', { message })
    } else {
      const message = ''
      return res.render('login', { message })
    }
  },

  getForgotpass: (req, res) => {
    req.session.auth = null
    req.session.email = null
    req.session.user = null
    if (req.session.message) {
      const message = req.session.message
      req.session.message = null
      return res.render('forgotPass', { message })
    } else {
      const message = ''
      return res.render('forgotPass', { message })
    }
  },

  getForgotPassOtp: (req, res) => {
    return res.render('forgot-otp')
  },

  getChangePass: (req, res) => {
    return res.render('changePass')
  },

  getLanding: (req, res) => {
    const landing = [
      { img: '/images/7.jpg', price: 'Rs.100', name: 'Spiritual  Moment', text: 'This premium vodka is smooth and perfectly blends with your senses, giving an enriched taste. ' },
      { img: '/images/6.jpg', price: 'Rs.800', name: 'Rose Cometa', text: 'A great white wine from southern Italian grapes, comparable with great white wines of the world' },
      { img: '/images/9.jpg', price: 'Rs.700', name: 'Chakras', text: 'Chakras Cabernet Sauvignon has a ruby red color and aromas of black cherries and cassis.' },
      { img: 'images/4.jpg', price: 'Rs.100', name: 'Blue comet', text: 'Chakras Cabernet Sauvignon has a ruby red color and aromas of black cherries and cassis.' },
      { img: '/images/10.jpg', price: 'Rs.900', name: 'Orange Wine', text: "It's a type of white wine made by leaving the grape skins and seeds in contact with the juice." },
      { img: '/images/11.jpg', price: 'Rs.500', name: 'Djiulle Diuxe', text: 'A cool drink from Lombardia, Northern Italy, Italy. Made from Merlot, Cabernet Sauvignon. ' },
      { img: '/images/12.jpg', price: 'Rs.200', name: 'Vanishing Tides', text: ' A crisp, clean, and refreshing premium lager brewed in the Czech Pilsner style.' },
      { img: '/images/5.jpg', price: 'Rs.600', name: 'Cider Fiction', text: "The Cider Fiction, the latest cider brand from Pinnacle Drinks.It's created by a renowned winemaker" }
    ]
    return res.render('landing-page', { landing })
  },

  getSingleProduct: async (req, res) => {
    try {
      const id = await req.params._id
      const userid = await req.session.user._id
      const product = await Product.findById(id).populate('category')
      const user = await User.findById(userid)
      if (!product) {
        return res.status(500).json({ success: false })
      }
      return res.render('userSingleProduct', { product, user })
    } catch (e) {
      return res.render('userSingleProduct', { message: 'Error Message' })
    }
  },

  getCart: async (req, res) => {
    try {
      const user = await User.find({ email: req.session.email }).populate('cart.id')
      if (user[0].cart.length === 0) {
        return res.render('emptyCart')
      } else {
        const cartItems = user[0].cart
        cartItems.forEach((item) => {
          if (item.quantity >= item.id.stock) {
            item.increment = true
          } else if (item.quantity === 1) {
            item.decrement = true
          }
        })
        const totalPrice = cartItems.reduce((total, item) => {
          return total + (item.quantity * item.id.price)
        }, 0)

        const totalCount = cartItems.reduce((total, item) => {
          return total + (item.quantity)
        }, 0)

        return res.render('cart', { cartItems, totalPrice, totalCount })
      }
    } catch (e) {
      return res.send('not working')
    }
  },

  addToCart: async (req, res) => {
    try {
      const id = req.params._id
      const user = await User.find({ email: req.session.email })
      const item = {
        id,
        quantity: 1
      }

      if (user[0].cart.length === 0) {
        user[0].cart.push(item)
        await user[0].save()
        return res.json({ redirect: '/getcart' })
      } else {
        const resl = user[0].cart.findIndex((item) => {
          return item.id.valueOf() === `${id}`
        })
        if (resl === -1) {
          user[0].cart.push(item)
        } else {
          user[0].cart[resl].quantity = user[0].cart[resl].quantity + 1
        }
        await user[0].save()
      }
      return res.status(200).json({ redirect: '/home' })
    } catch (err) {
      return res.status(404).render('page-not-found')
    }
  },

  increment: async (req, res) => {
    try {
      const id = req.params._id
      const user = await User.find({ email: req.session.email })
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
      user[0].cart[index].quantity = user[0].cart[index].quantity + 1
      await user[0].save()
      return res.status(200).json({ redirect: '/getcart' })
    } catch (err) {
      return res.status(404).render('page-not-found')
    }
  },

  decrement: async (req, res) => {
    const id = req.params._id
    try {
      const user = await User.find({ email: req.session.email })
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
      user[0].cart[index].quantity = user[0].cart[index].quantity - 1
      await user[0].save()
      return res.status(200).json({ redirect: '/getcart' })
    } catch (e) {
      return res.status(404).render('page-not-found')
    }
  },

  deleteCart: async (req, res) => {
    const id = await req.params._id
    try {
      const user = await User.find({ email: req.session.email })
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
      user[0].cart.splice(index, 1)
      await user[0].save()
      return res.status(200).json({ redirect: '/getcart' })
    } catch (err) {
      return res.status(404).render('page-not-found')
    }
  },

  getOrder: async (req, res) => {
    const user = await User.find({ email: req.session.email }).populate('cart.id')

    const cartItems = user[0].cart

    const totalQuantity = cartItems.reduce((total, item) => {
      return total + item.quantity
    }, 0)

    const totalPrice = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.id.price)
    }, 0)
    if (req.session.message != null && req.session.message1 != null) {
      const couponMessage = req.session.message
      const couponApplied = req.session.message1
      req.session.message = null
      req.session.message1 = null
      return res.render('order', { user: user[0], totalPrice: couponApplied[1], totalQuantity: couponApplied[2], couponMessage, couponApplied: couponApplied[0] })
    } else {
      return res.render('order', { user: user[0], cartItems, totalQuantity, totalPrice })
    }
  },

  newShippingAddress: async (req, res) => {
    const id = req.params._id
    try {
      const user = await User.find({ _id: id })
      user[0].address.push(req.body)
      await user[0].save()
      return res.redirect('/checkout')
    } catch (e) {
      return res.status(404).render('page-not-found')
    }
  },
  getEditAddress: async (req, res) => {
    const addressId = await req.params._id

    const addressAggr = await User.aggregate([
      { $match: { email: req.session.email } },
      { $unwind: '$address' },
      { $match: { 'address._id': ObjectId(addressId) } }

    ])
    const addressObj = addressAggr[0].address
    return res.render('edit-address', { addressObj })
  },

  updateAddress: async (req, res) => {
    try {
      const addressId = await req.params._id
      const user = await User.find({ email: req.session.email })
      const index = user[0].address.findIndex((item) => {
        return item._id.valueOf() === addressId
      })
      const { houseName, phone, city, postalCode, state, country } = req.body
      user[0].address[index].houseName = houseName
      user[0].address[index].phone = phone
      user[0].address[index].city = city
      user[0].address[index].postalCode = postalCode
      user[0].address[index].state = state
      user[0].address[index].country = country
      await user[0].save()
      return res.json({ redirect: '/checkout' })
    } catch (err) {
      return res.status(404).render('page-not-found')
    }
  },

  createOrder: async (req, res) => {
    const { totalAmount, orderStatus, paymentMethod, shippingInfo } = req.body
    try {
      const user = await User.find({ email: req.session.email })
      const index = user[0].address.findIndex((item) => {
        return item._id.valueOf() == shippingInfo
      })
      const shippingAddres = user[0].address[index]
      if (paymentMethod == 'cash on delivery') {
        const newOrder = await Order.create({
          shippingInfo: shippingAddres,
          user: user[0]._id,
          orderItems: user[0].cart,
          totalAmount,
          orderStatus,
          paymentMode: paymentMethod
        })
        user[0].cart.splice(0)
        await user[0].save({ validateBeforeSave: false })
        await newOrder.save()
        return res.json({ redirect: '/order/success' })
      } else if (paymentMethod === 'Razor pay') {
        const instance = new Razorpay({
          key_id: process.env.RAZ_KEY_ID,
          key_secret: process.env.RAZ_KEY_SECRET
        })
        const myOrder = await instance.orders.create({
          amount: totalAmount * 100,
          currency: 'INR',
          receipt: process.env.RAZ_RECEIPT
        })

        const newOrder = await Order.create({
          shippingInfo: shippingAddres,
          user: user[0]._id,
          orderItems: user[0].cart,
          totalAmount,
          orderStatus,
          paymentMode: paymentMethod
        })
        user[0].cart.splice(0)
        await user[0].save({ validateBeforeSave: false })
        await newOrder.save()
        return res.json({ myOrder, redirect: '/order/success' })
      }
    } catch (e) {
      return res.status(404).render('page-not-found')
    }
  },

  orderSuccess: async (req, res) => {
    return res.render('payment-success')
  },

  getUserOrder: async (req, res) => {
    const user = await User.find({ email: req.session.email })
    const userId = user[0]._id
    const orders = await Order.find({ user: userId }).populate('orderItems.id').sort({ createdAt: -1 })
    return res.render('user-profile', { order: orders, id: req.session._id, user })
  },

  cancelOrder: async (req, res) => {
    const id = req.params._id
    const user = await User.find({ email: req.session.email })
    try {
      await Order.find({ id })
      await Order.findOneAndUpdate({ _id: id }, { isCancelled: true }, { user })
      return res.json({ redirect: '/user-order' })
    } catch (err) {
      return res.status(404).render('page-not-found')
    }
  },

  returnOrder: async (req, res) => {
    try {
      const id = req.params._id
      const order = await Order.find({ _id: id })
      order[0].isReturned = true
      order[0].isDelivered = false
      order[0].isCancelled = false
      await order[0].save()
      return res.json({ redirect: '/user-order' })
    } catch (e) {
      return res.status(404).render('page-not-found')
    }
  },
  viewUserOrder: async (req, res) => {
    const id = req.params._id
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
    return res.render('userViewOrder', { arr })
  },
  // -------------------------------Coupon-------------------------------------//
  getCouponpage: async (req, res) => {
    const couponMessage = req.session.message
    req.session.message = null
    return res.render('user-coupon', { couponMessage })
  },

  applyCoupon: async (req, res) => {
    try {
      const user = await User.find({ email: req.session.email }).populate('cart.id')
      const coupon = await Coupon.find({ couponCode: req.body.coupon })
      const cartItems = user[0].cart
      const totalQuantity = cartItems.reduce((total, item) => {
        return total + item.quantity
      }, 0)
      let totalPrice = cartItems.reduce((total, item) => {
        return total + (item.quantity * item.id.price)
      }, 0)
      if (coupon.length === 0) {
        req.session.message = 'Please enter a valid coupon'
        return res.redirect('/user-coupon')
      } else if (totalPrice <= coupon[0].minDiscountAmount) {
        req.session.message = 'Coupon is not applicable for this price !!'
        return res.redirect('/user-coupon')
      } else {
        const isCouponUsed = coupon[0].users.some((item) => {
          return item.id.valueOf() === `${req.session._userId}`
        })
        if (isCouponUsed) {
          req.session.message = 'Oops ..!! Coupon already used'
          return res.redirect('/user-coupon')
        } else {
          const userCoupon = { id: req.session.user._id }
          coupon[0].users.push(userCoupon)
          await coupon[0].save()
          totalPrice = totalPrice - (totalPrice * coupon[0].discountPercentage) / 100
          const couponApplied = true
          req.session.message = 'Coupon applied 🎁'
          req.session.message1 = [couponApplied, totalPrice, totalQuantity]
          return res.redirect('/checkout')
        }
      }
    } catch (err) {
      return res.status(404).render('page-not-found')
    }
  },

  getShop: async (req, res) => {
    const categories = await Category.find({ isBlocked: false })
    const productList = await Product.find().populate('category')

    if (!productList) {
      return res.staus(500).json({ success: false })
    }
    return res.render('shop', { categories, productList: req.session.productList ? req.session.productList : productList, search: req.session.search ? req.session.search : '' })
  },
  searchProducts: async (req, res) => {
    const searchTerm = req.body.input
    try {
      const productList = await Product.find({ name: { $regex: searchTerm, $options: 'i' } })
      req.session.search = searchTerm
      req.session.productList = productList
      return res.json({ redirect: ('/shop') })
    } catch (error) {
      return res.status(500).send(error.message)
    }
  },
  filterProducts: async (req, res) => {
    try {
      const id = await req.params._id
      const categories = await Category.find({ isBlocked: false })
      const productList = await Product.find({ isBlocked: false, category: id }).populate('category')

      return res.render('shop', { productList, categories })
    } catch (e) {
      return res.status(404).render('page-not-found')
    }
  },
  sortProducts: async (req, res) => {
    try {
      const categories = await Category.find({ isBlocked: false })
      const id = req.params._id
      const ascending = await Product.find().sort({ name: 1 })
      const highPrice = await Product.find().sort({ price: -1 })
      const lowPrice = await Product.find().sort({ price: 1 })

      if (id === 'az') {
        return res.render('shop', { productList: ascending, categories })
      } else if (id === 'hl') {
        return res.render('shop', { productList: highPrice, categories })
      } else {
        return res.render('shop', { productList: lowPrice, categories })
      }
    } catch (e) {
      return res.status(404).render('page-not-found')
    }
  },
  // ----------------------------------------------------------------//

  existUser: async (req, res, next) => {
    const existing = await User.find({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
    if (existing == 0) {
      req.session.user = {
        firstname: req.body.fname,
        lastname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password1
      }
      next()
      return res.redirect('/otp')
    } else {
      req.session.message = 'User Already Exists'
      return res.redirect('/register')
    }
  },

  generateOtp: (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    req.session.otpOne = otp
    req.session.phone = req.body.phone
    sendOtp(otp, req.body.phone)
  },

  checkOtp: async (req, res) => {
    if (req.body.otp == req.session.otpOne) {
      const user = new User(req.session.user)
      try {
        await user.save()
        return res.redirect('/login')
      } catch (error) {
        return res.redirect('/register')
      }
    } else {
      return res.json({
        message: 'Invalid OTP'
      })
    }
  },

  fetchOtp: async (req, res, next) => {
    const phoneformat = /^\d{10}$/
    const phone = req.body.phone
    if (phone.match(phoneformat)) {
      next()
      return res.redirect('/forgotOtp')
    } else {
      req.session.message = 'Enter a valid phone number'
      return res.redirect('/forgot')
    }
  },

  changepass: (req, res) => {
    if (req.body.otp == req.session.otpOne) {
      try {
        return res.redirect('/changepass')
      } catch (error) {
        res.status(404).render('page-not-found')
      }
    } else {
      return res.json({
        message: 'Invalid OTP'
      })
    }
  },

  changed: async (req, res) => {
    const existphone = await User.findOne({ phone: req.session.phone })
    if (existphone) {
      try {
        await User.updateOne({ phone: req.session.phone }, { $set: { password: req.body.password } })
        req.session.password = req.body.password
        return res.redirect('/login')
      } catch (e) {
        res.status(404).render('page-not-found')
      }
    } else {
      return res.redirect('/changepass')
    }
  },

  loginUser: async (req, res) => {
    try {
      const registeredUser = await User.findOne({ email: req.body.email })
      const blocked = (registeredUser.isBlocked == true)
      if (registeredUser && !blocked) {
        try {
          const passMatch = await bcrypt.compare(req.body.password, registeredUser.password) || registeredUser.password
          if (passMatch) {
            req.session.auth = true
            req.session.email = req.body.email
            req.session.user = registeredUser
            return res.redirect('/home')
          } else {
            req.session.message = 'Wrong Password'
            return res.redirect('/login')
          }
        } catch (error) {
          return res.status(404).render('page-not-found')
        }
      } else {
        req.session.message = 'You have been blocked'
        return res.redirect('/login')
      }
    } catch (error) {
      req.session.message = 'No user Found'
      return res.redirect('/login')
    }
  },
  logoutUser: (req, res) => {
    req.session.auth = null
    req.session.email = null
    req.session.user = null
    return res.redirect('/logout')
  }
}

function sendOtp (otp, number) {
  const body = {
    authorization: process.env.AUTHORIZATION_KEY,
    variables_values: otp,
    route: 'otp',
    numbers: number
  }
  return axios({
    method: 'GET',
    url: 'https://www.fast2sms.com/dev/bulkV2',
    data: body
  })
}
