const session = require('express-session')
const { User } = require('../model/users')
const { Product } = require('../model/product')
const Order = require('../model/order')
// const bcrypt = require('bcrypt')
const Razorpay = require('razorpay');
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
      { img: "/images/7.jpg", price: "Rs.100", name: "Spiritual  Moment", text: "This premium vodka is smooth and perfectly blends with your senses, giving an enriched taste. " },
      { img: "/images/6.jpg", price: "Rs.800", name: "Rose Cometa", text: "A great white wine from southern Italian grapes, comparable with great white wines of the world" },
      { img: "/images/9.jpg", price: "Rs.700", name: "Chakras", text: "Chakras Cabernet Sauvignon has a ruby red color and aromas of black cherries and cassis." },
      { img: "images/4.jpg", price: "Rs.100", name: "Blue comet", text: "Chakras Cabernet Sauvignon has a ruby red color and aromas of black cherries and cassis." },
      { img: "/images/10.jpg", price: "Rs.900", name: "Orange Wine", text: "It's a type of white wine made by leaving the grape skins and seeds in contact with the juice." },
      { img: "/images/11.jpg", price: "Rs.500", name: "Djiulle Diuxe", text: "A cool drink from Lombardia, Northern Italy, Italy. Made from Merlot, Cabernet Sauvignon. " },
      { img: "/images/12.jpg", price: "Rs.200", name: "Vanishing Tides", text: " A crisp, clean, and refreshing premium lager brewed in the Czech Pilsner style." },
      { img: "/images/5.jpg", price: "Rs.600", name: "Cider Fiction", text: "The Cider Fiction, the latest cider brand from Pinnacle Drinks.It's created by a renowned winemaker" },
    ];
    return res.render('landing-page', { landing })
  },

  getSingleProduct: async (req, res) => {
    try {
      console.log("getSingleProduct")
      const id = await req.params._id
      const userid = await req.session.user._id
      console.log(userid)
      const product = await Product.findById(id).populate('category');
      const user = await User.findById(userid)
      console.log(product);
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
      console.log("\ngetCart or emptycart")
      // console.log(req.session.email);
      const user = await User.find({ email: req.session.email }).populate('cart.id')
      // console.log(user[0]);
      // console.log(user[0].cart);
      if (user[0].cart.length === 0) {
        res.render('emptyCart');
      }
      else {
        const cartItems = user[0].cart;
        cartItems.forEach((item) => {
          if (item.quantity >= item.id.stock) {
            item.increment = true
          }
          else if (item.quantity === 1) {
            item.decrement = true;
          }
        })
        const totalPrice = cartItems.reduce((total, item) => {
          return total + (item.quantity * item.id.price)
        }, 0);

        const totalCount = cartItems.reduce((total, item) => {
          return total + (item.quantity)
        }, 0);

        res.render('cart', { cartItems, totalPrice, totalCount })
      }
    } catch (e) {
      console.log(e)
      res.send("not working")
    }
  },

  addToCart: async (req, res) => {
    try {
      const id = req.params._id
      // console.log(id);
      // console.log(req.session.email);
      const user = await User.find({ email: req.session.email });
      console.log('user here');
      console.log(user);
      const item = {
        id: id,
        quantity: 1
      };
      console.log(item);

      if (user[0].cart.length === 0) {
        console.log('product saved!!');
        user[0].cart.push(item);
        await user[0].save();
        return res.json({ redirect: "/getcart" })
      } else {
        console.log('else working!');
        const resl = user[0].cart.findIndex((item) => {
          return item.id.valueOf() === `${id}`
        })
        console.log(resl)
        if (resl === -1) {
          user[0].cart.push(item);
        } else {
          console.log('inner else working!');
          user[0].cart[resl].quantity = user[0].cart[resl].quantity + 1;
          console.log(user[0].cart[resl].quantity);
        }
        await user[0].save();
      }
      return res.status(200).json({ redirect: "/home" })
    } catch (err) {
      console.log(err)
    }
  },

  increment: async (req, res) => {
    console.log('increment works!!')
    try {
      const id = req.params._id;
      console.log(id);
      const user = await User.find({ email: req.session.email })
      console.log(user);
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` });
      console.log(index);
      user[0].cart[index].quantity = user[0].cart[index].quantity + 1;
      await user[0].save();
      return res.status(200).json({ redirect: "/getcart" })
    } catch (err) {
      console.log(err);
    }
  },

  decrement: async (req, res) => {
    console.log('decrement works!!');
    const id = req.params._id;
    try {
      const user = await User.find({ email: req.session.email });
      console.log(user);
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` });
      user[0].cart[index].quantity = user[0].cart[index].quantity - 1;
      await user[0].save();
      return res.status(200).json({ redirect: "/getcart" })
    } catch (e) {
      console.log(e);
    }
  },

  deleteCart: async (req, res) => {
    console.log('delete works started!!');
    const id = await req.params._id;
    console.log(id);
    try {
      const user = await User.find({ email: req.session.email });
      console.log(user);
      const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
      console.log(index);
      user[0].cart.splice(index, 1);
      await user[0].save();
      // res.json({ redirect: '/cart' });
      return res.status(200).json({ redirect: "/getcart" })
    } catch (err) {
      console.log(err);
    }
  },

  getOrder: async (req, res) => {
    console.log("\ngetOrder\n")
    const user = await User.find({ email: req.session.email }).populate('cart.id');

    const cartItems = user[0].cart

    const totalQuantity = cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    const totalPrice = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.id.price)
    }, 0);

    res.render('order', { user: user[0], cartItems: cartItems, totalQuantity: totalQuantity, totalPrice: totalPrice })

  },

  newShippingAddress: async (req, res) => {
    console.log('\nshipping address working!!\n');
    const id = req.params._id;
    try {
      const user = await User.find({ _id: id });
      user[0].address.push(req.body);
      await user[0].save();
      res.redirect('/checkout');
    } catch (e) {
      console.log(e);
    }
  },

  createOrder: async (req, res) => {
    const { totalAmount, orderStatus, paymentMethod, shippingInfo } = req.body;
    console.log(totalAmount);
    console.log(orderStatus);
    console.log(paymentMethod);
    console.log(shippingInfo);
    try {
      console.log('try');
      const user = await User.find({ email: req.session.email });
      // console.log(user[0]._id);
      const index = user[0].address.findIndex((item) => {
        return item._id.valueOf() == shippingInfo;
      })
      // console.log(index);
      let shippingAddres = user[0].address[index];
      // console.log(shippingAddres);
      // console.log(req.session.userid)
      //order schemadetails setup
      if (paymentMethod == 'cash on delivery') {
        console.log('if  cod controller wroks!!');
        const newOrder = await Order.create({
          shippingInfo: shippingAddres,
          user: user[0]._id,
          orderItems: user[0].cart,
          totalAmount: totalAmount,
          orderStatus: orderStatus,
          paymentMode: paymentMethod,
        })
        // console.log('1');
        // console.log(user[0].cart);
        // console.log('order item below');
        // console.log(newOrder.orderItems);
        user[0].cart.splice(0);
        // console.log(user[0].cart);
        await user[0].save({ validateBeforeSave: false });
        //saving the order
        await newOrder.save();
        console.log('order saved in db!!!');
        res.json({ redirect: '/order/success' });
      }
      else if (paymentMethod === 'Razor pay') {
        console.log('if razor pay controller works!!')
        let instance = new Razorpay({
          key_id: process.env.RAZ_KEY_ID,
          key_secret: process.env.RAZ_KEY_SECRET
        });
        // console.log(instance);
        const myOrder = await instance.orders.create({
          amount: totalAmount * 100,
          currency: "INR",
          // order_id: order.id,
          receipt: process.env.RAZ_RECEIPT
        })
        console.log(myOrder);

        const newOrder = await Order.create({
          shippingInfo: shippingAddres,
          user: user[0]._id,
          orderItems: user[0].cart,
          totalAmount: totalAmount,
          orderStatus: orderStatus,
          paymentMode: paymentMethod,
        })
        // console.log(newOrder);
        user[0].cart.splice(0);
        // console.log(user[0].cart);
        await user[0].save({ validateBeforeSave: false });
        //saving the order
        await newOrder.save();
        console.log('order saved in db!!!');
        res.json({ myOrder: myOrder, redirect: '/order/success' })
        console.log('end');
      }
    } catch (e) {
      console.log(e);
    }

  },

  orderSuccess: async (req, res) => {
    res.render('payment-success')
  },

  getUserOrder: async (req, res) => {
    console.log('getUser order works!');
    const user = await User.find({ email: req.session.email });
    const userId = user[0]._id
    console.log(userId);
    const orders = await Order.find({ user: userId }).populate('orderItems.id').sort({createdAt: -1});
    // console.log(orders)
    // const user = await User.find({ Email: req.session.email })
    // console.log(user)
    res.render('user-profile', { order: orders, id: req.session._id, user: user })
    // if (orders.length == 0) {
    //   res.render('user-order-empty')
    // } else {
      
    // }
  },

  cancelOrder: async (req, res) => {
    console.log('Cancel order works!')
    const id = req.params._id
    const user = await User.find({ email: req.session.email })
    // console.log(user);
    console.log(id);
    try {
      const order = await Order.find({ id: id })
      console.log(order);
      const cancelOrder = await Order.findOneAndUpdate({ _id: id }, { isCancelled: true }, { user: user });
      res.json({ redirect: '/order/user-order' });
    } catch (err) {
      console.log(err);
    }
  },


  //----------------------------------------------------------------//


  existUser: async (req, res, next) => {
    const existing = await User.find({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
    if (existing == 0) {
      req.session.user = {
        firstname: req.body.fname,
        lastname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password1,
      }
      next();
      res.redirect('/otp');

    } else {
      req.session.message = 'User Already Exists'
      return res.redirect('/register')
    }
  },

  generateOtp: (req, res) => {
    console.log('generateOtp')
    let otp = Math.floor(100000 + Math.random() * 900000)
    console.log(otp + " " + req.body.phone);
    req.session.otpOne = otp;
    req.session.phone = req.body.phone
    sendOtp(otp, req.body.phone)
  },

  checkOtp: async (req, res) => {
    console.log('check otp')
    console.log(req.session);
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

  fetchOtp: (req, res, next) => {
    console.log("forgot otp-page(enter phone number")
    const phoneformat = /^\d{10}$/;
    const phone = req.body.phone;
    console.log(phone.match(phoneformat))
    if (phone.match(phoneformat)) {
      next()
      return res.redirect('/forgotOtp') //res.render('forgot-otp')            
    } else {
      req.session.message = 'Enter a valid phone number'
      return res.redirect('/forgot') // res.render('forgotPass',{message:'Enter a valid phone number'})
    }
  },

  changepass: (req, res) => {
    console.log('check otp for new password')
    console.log(req.session);
    console.log(req.session.otpOne)
    console.log(req.body.otp)
    if (req.body.otp == req.session.otpOne) {
      try {
        return res.redirect('/changepass')// return res.render('changePass')
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
      return res.redirect('/changepass')// return res.render('changePass',{message:''})
    }
  },

  loginUser: async (req, res) => {
    try {
      console.log("Logged in");
      const registeredUser = await User.findOne({ email: req.body.email })
      const blocked = (registeredUser.isBlocked == true)
      console.log(registeredUser || !blocked)
      if (registeredUser && !blocked) {
        try {
          console.log(registeredUser.email + " " + registeredUser.password)
          const pass_match = await bcrypt.compare(req.body.password, registeredUser.password)
          console.log(req.body.password, registeredUser.password)
          if (pass_match) {
            req.session.auth = true
            req.session.email = req.body.email
            req.session.user = registeredUser
            console.log("hi\n" + req.session.user)
            return res.redirect('/home') //res.render('home-page')
          } else {
            req.session.message = 'Wrong Password'
            return res.redirect('/login')// res.render('login',{message:'You are not a registered User'})
          }
        } catch (error) {
          console.log(error)
        }
      }
      else {
        req.session.message = 'You have been blocked'
        return res.redirect('/login')//res.render('login',{message:'You are not a registered User'})
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


function sendOtp(otp, number) {
  console.log('sent otp')
  console.log(otp)
  const body = {
    "authorization": process.env.AUTHORIZATION_KEY,
    "variables_values": otp,
    "route": "otp",
    "numbers": number
  }
  return axios({
    method: 'GET',
    url: 'https://www.fast2sms.com/dev/bulkV2',
    data: body
  })
}