/* eslint-disable eqeqeq */
const { ObjectId } = require('mongodb')
const { User } = require('../model/users')
const { Product } = require('../model/product')
const Order = require('../model/order')
const Coupon = require('../model/coupon')
// const bcrypt = require('bcrypt')
// const session = require('express-session')
const Razorpay = require('razorpay')
const bcrypt = require('bcrypt')
const axios = require('axios')
require('dotenv').config()

module.exports = {
  getHomepage: async (req, res) => {
    const product = await Product.find()
    console.log(req.session.user)
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
      console.log('getSingleProduct')
      const id = await req.params._id
      const userid = await req.session.user._id
      console.log(userid)
      const product = await Product.findById(id).populate('category')
      const user = await User.findById(userid)
      console.log(product)
      if (!product) {
        res.status(500).json({ success: false })
      }
      return res.render('userSingleProduct', { product, user })
    } catch (e) {
      return res.render('userSingleProduct', { message: 'Error Message' })
    }
  },

  getCart: async (req, res) => {
    try {
      console.log('\ngetCart or emptycart')
      const user = await User.find({ email: req.session.email }).populate('cart.id')
      if (user[0].cart.length === 0) {
        res.render('emptyCart')
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

        res.render('cart', { cartItems, totalPrice, totalCount })
      }
    } catch (e) {
      console.log(e)
      res.send('not working')
    }
  },

  addToCart: async (req, res) => {
    try {
      const id = req.params._id
      const user = await User.find({ email: req.session.email })
      console.log('user here')
      console.log(user)
      const item = {
        id,
        quantity: 1
      }
      console.log(item)

      if (user[0].cart.length === 0) {
        console.log('product saved!!')
        user[0].cart.push(item)
        await user[0].save()
        return res.json({ redirect: '/getcart' })
      } else {
        console.log('else working!')
        const resl = user[0].cart.findIndex((item) => {
          return item.id.valueOf() === `${id}`
        })
        console.log(resl)
        if (resl === -1) {
          user[0].cart.push(item)
        } else {
          console.log('inner else working!')
          user[0].cart[resl].quantity = user[0].cart[resl].quantity + 1
          console.log(user[0].cart[resl].quantity)
        }
        await user[0].save()
      }
      return res.status(200).json({ redirect: '/home' })
    } catch (err) {
      console.log(err)
    }
  },

  increment: async (req, res) => {
    console.log('increment works!!')
    try {
      const id = req.params._id
      console.log(id)
      const user = await User.find({ email: req.session.email })
      console.log(user)
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
      console.log(index)
      user[0].cart[index].quantity = user[0].cart[index].quantity + 1
      await user[0].save()
      return res.status(200).json({ redirect: '/getcart' })
    } catch (err) {
      console.log(err)
    }
  },

  decrement: async (req, res) => {
    console.log('decrement works!!')
    const id = req.params._id
    try {
      const user = await User.find({ email: req.session.email })
      console.log(user)
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
      user[0].cart[index].quantity = user[0].cart[index].quantity - 1
      await user[0].save()
      return res.status(200).json({ redirect: '/getcart' })
    } catch (e) {
      console.log(e)
    }
  },

  deleteCart: async (req, res) => {
    console.log('delete works started!!')
    const id = await req.params._id
    console.log(id)
    try {
      const user = await User.find({ email: req.session.email })
      console.log(user)
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
      console.log(index)
      user[0].cart.splice(index, 1)
      await user[0].save()
      return res.status(200).json({ redirect: '/getcart' })
    } catch (err) {
      console.log(err)
    }
  },

  getOrder: async (req, res) => {
    console.log('\ngetOrder\n')
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
      res.render('order', { user: user[0], totalPrice: couponApplied[1], totalQuantity: couponApplied[2], couponMessage, couponApplied: couponApplied[0] })
    } else {
      res.render('order', { user: user[0], cartItems, totalQuantity, totalPrice })
    }
  },

  newShippingAddress: async (req, res) => {
    console.log('\nshipping address working!!\n')
    const id = req.params._id
    try {
      const user = await User.find({ _id: id })
      user[0].address.push(req.body)
      await user[0].save()
      res.redirect('/checkout')
    } catch (e) {
      console.log(e)
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
    // console.log(addressObj)
    res.render('edit-address', { addressObj })
  },

  updateAddress: async (req, res) => {
    console.log(req.body.houseName)
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
      console.log('Update Done')
      return res.json({ redirect: '/checkout' })
    } catch (err) {
      console.log(err)
    }
  },

  createOrder: async (req, res) => {
    const { totalAmount, orderStatus, paymentMethod, shippingInfo } = req.body
    console.log(totalAmount)
    console.log(orderStatus)
    console.log(paymentMethod)
    console.log(shippingInfo)
    try {
      console.log('try')
      const user = await User.find({ email: req.session.email })
      const index = user[0].address.findIndex((item) => {
        return item._id.valueOf() == shippingInfo
      })
      const shippingAddres = user[0].address[index]
      if (paymentMethod == 'cash on delivery') {
        console.log('if  cod controller wroks!!')
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
        console.log('order saved in db!!!')
        res.json({ redirect: '/order/success' })
      } else if (paymentMethod === 'Razor pay') {
        console.log('if razor pay controller works!!')
        const instance = new Razorpay({
          key_id: process.env.RAZ_KEY_ID,
          key_secret: process.env.RAZ_KEY_SECRET
        })
        const myOrder = await instance.orders.create({
          amount: totalAmount * 100,
          currency: 'INR',
          receipt: process.env.RAZ_RECEIPT
        })
        console.log(myOrder)

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
        console.log('order saved in db!!!')
        res.json({ myOrder, redirect: '/order/success' })
        console.log('end')
      }
    } catch (e) {
      console.log(e)
    }
  },

  orderSuccess: async (req, res) => {
    res.render('payment-success')
  },

  getUserOrder: async (req, res) => {
    const user = await User.find({ email: req.session.email })
    const userId = user[0]._id
    console.log(userId)
    const orders = await Order.find({ user: userId }).populate('orderItems.id').sort({ createdAt: -1 })
    res.render('user-profile', { order: orders, id: req.session._id, user })
  },

  cancelOrder: async (req, res) => {
    const id = req.params._id
    const user = await User.find({ email: req.session.email })
    console.log(id)
    try {
      await Order.find({ id })
      await Order.findOneAndUpdate({ _id: id }, { isCancelled: true }, { user })
      res.json({ redirect: '/user-order' })
    } catch (err) {
      console.log(err)
    }
  },

  returnOrder: async (req, res) => {
    console.log('return order works!')
    try {
      const id = req.params._id
      const order = await Order.find({ _id: id })
      order[0].isReturned = true
      order[0].isDelivered = false
      order[0].isCancelled = false
      await order[0].save()
      res.json({ redirect: '/user-order' })
    } catch (e) {
      console.log(e)
    }
  },
  viewUserOrder: async (req, res) => {
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
    res.render('userViewOrder', { arr })
  },
  // -------------------------------Coupon-------------------------------------//
  getCouponpage: async (req, res) => {
    const couponMessage = req.session.message
    req.session.message = null
    res.render('user-coupon', { couponMessage })
  },

  applyCoupon: async (req, res) => {
    try {
      const user = await User.find({ email: req.session.email }).populate('cart.id')
      const coupon = await Coupon.find({ couponCode: req.body.coupon })
      console.log(coupon)
      const cartItems = user[0].cart
      const totalQuantity = cartItems.reduce((total, item) => {
        return total + item.quantity
      }, 0)
      let totalPrice = cartItems.reduce((total, item) => {
        return total + (item.quantity * item.id.price)
      }, 0)
      if (coupon.length === 0) {
        console.log('if worked')
        req.session.message = 'Please enter a valid coupon'
        res.redirect('/user-coupon')
      } else if (totalPrice <= coupon[0].minDiscountAmount) {
        req.session.message = 'Coupon is not applicable for this price !!'
        res.redirect('/user-coupon')
      } else {
        const isCouponUsed = coupon[0].users.some((item) => {
          return item.id.valueOf() === `${req.session._userId}`
        })
        if (isCouponUsed) {
          req.session.message = 'Oops ..!! Coupon already used'
          res.redirect('/user-coupon')
        } else {
          console.log('else working')
          console.log(req.session.user)
          const userCoupon = { id: req.session.user._id }
          coupon[0].users.push(userCoupon)
          await coupon[0].save()
          totalPrice = totalPrice - (totalPrice * coupon[0].discountPercentage) / 100
          console.log(totalPrice)
          const couponApplied = true
          req.session.message = 'Coupon applied 🎁'
          req.session.message1 = [couponApplied, totalPrice, totalQuantity]
          res.redirect('/checkout')
        }
      }
    } catch (err) {
      console.log(err)
    }
  },

  getShop: async (req, res) => {
    const productList = await Product.find().populate('category')
    // console.log(productList)
    if (!productList) {
      res.staus(500).json({ success: false })
    }
    res.render('shop', { productList: req.session.productList ? req.session.productList : productList, search: req.session.search ? req.session.search : '' })
  },
  searchProducts: async (req, res) => {
    console.log(req.body.input)
    const searchTerm = req.body.input
    try {
      const productList = await Product.find({ name: { $regex: searchTerm, $options: 'i' } })
      console.log(productList)
      req.session.search = searchTerm
      req.session.productList = productList
      return res.json({ redirect: ('/shop') })
    } catch (error) {
      res.status(500).send(error.message)
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
      res.redirect('/otp')
    } else {
      req.session.message = 'User Already Exists'
      return res.redirect('/register')
    }
  },

  generateOtp: (req, res) => {
    console.log('generateOtp')
    const otp = Math.floor(100000 + Math.random() * 900000)
    console.log(otp + ' ' + req.body.phone)
    req.session.otpOne = otp
    req.session.phone = req.body.phone
    sendOtp(otp, req.body.phone)
  },

  checkOtp: async (req, res) => {
    console.log('check otp')
    console.log(req.session)
    console.log(req.session.otpOne)
    console.log(req.body.otp)
    if (req.body.otp == req.session.otpOne) {
      const user = new User(req.session.user)
      console.log(user)
      try {
        await user.save()
        return res.redirect('/login')
      } catch (error) {
        console.log(error)
        return res.redirect('/register')
      }
    } else {
      return res.json({
        message: 'Invalid OTP'
      })
    }
  },

  fetchOtp: async (req, res, next) => {
    console.log('forgot otp-page(enter phone number')
    const phoneformat = /^\d{10}$/
    const phone = req.body.phone
    console.log(phone.match(phoneformat))
    if (phone.match(phoneformat)) {
      next()
      return res.redirect('/forgotOtp')
    } else {
      req.session.message = 'Enter a valid phone number'
      return res.redirect('/forgot')
    }
  },

  changepass: (req, res) => {
    console.log('check otp for new password')
    console.log(req.session)
    console.log(req.session.otpOne)
    console.log(req.body.otp)
    if (req.body.otp == req.session.otpOne) {
      try {
        return res.redirect('/changepass')
      } catch (error) {
        console.log(error)
      }
    } else {
      return res.json({
        message: 'Invalid OTP'
      })
    }
  },

  changed: async (req, res) => {
    const existphone = await User.findOne({ phone: req.session.phone })
    console.log(existphone)
    if (existphone) {
      try {
        const user = await User.updateOne({ phone: req.session.phone }, { $set: { password: req.body.password } })
        console.log(user)
        req.session.password = req.body.password
        return res.redirect('/login')
      } catch (e) {
        console.error(e)
      }
    } else {
      return res.redirect('/changepass')
    }
  },

  loginUser: async (req, res) => {
    try {
      console.log('Logged in')
      const registeredUser = await User.findOne({ email: req.body.email })
      const blocked = (registeredUser.isBlocked == true)
      console.log(registeredUser || !blocked)
      if (registeredUser && !blocked) {
        try {
          console.log(registeredUser.email + ' ' + registeredUser.password)
          const passMatch = await bcrypt.compare(req.body.password, registeredUser.password) || registeredUser.password
          console.log(req.body.password, registeredUser.password)
          if (passMatch) {
            req.session.auth = true
            req.session.email = req.body.email
            req.session.user = registeredUser
            console.log('hi\n' + req.session.user)
            return res.redirect('/home')
          } else {
            req.session.message = 'Wrong Password'
            return res.redirect('/login')
          }
        } catch (error) {
          console.log(error)
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
    res.redirect('/logout')
  }
}

function sendOtp (otp, number) {
  console.log('sent otp')
  console.log(otp)
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
