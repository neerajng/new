const express = require('express')
const userController = require('../controllers/userController')
const userAuth = require('../middlewares/users')
const verifyLogout = userAuth.isLoggedOut
const verifyLogin = userAuth.isLoggedIn
const router = express.Router()

router.get('/', verifyLogout, userController.getLanding)
router.get('/home', verifyLogin, userController.getHomepage)
router.get('/register', verifyLogout, userController.getRegister)
router.get('/otp', verifyLogout, userController.getRegisterOtp)
router.get('/login', verifyLogout, userController.getLogin)
router.get('/forgot', verifyLogout, userController.getForgotpass)
router.get('/forgotOtp', verifyLogout, userController.getForgotPassOtp)
router.get('/changepass', verifyLogout, userController.getChangePass)
router.get('/shop', verifyLogin, userController.getShop)
router.get('/singleProduct/:_id', verifyLogin, userController.getSingleProduct)
router.get('/logout', verifyLogin, userController.logoutUser)
// ------------------------get routes----------------------------//

router.post('/register', userController.existUser, userController.generateOtp)
router.post('/otp', userController.checkOtp)
router.post('/login', userController.loginUser)
router.post('/forgot', userController.fetchOtp, userController.generateOtp)
router.post('/forgotOtp', userController.changepass)
router.post('/changepass', userController.changed)

//= ============================Cart Feature===========================================//
router.get('/getcart', verifyLogin, userController.getCart)
router.post('/add-to-cart/:_id', verifyLogin, userController.addToCart)
router.put('/inc/:_id', verifyLogin, userController.increment)
router.put('/dec/:_id', verifyLogin, userController.decrement)
router.delete('/delete/:_id', verifyLogin, userController.deleteCart)

//= ============================Order Feature===========================================//
router.get('/checkout', verifyLogin, userController.getOrder)

router.post('/order/address/:_id', userController.newShippingAddress)
router.get('/edit/address/:_id', verifyLogin, userController.getEditAddress)
router.put('/edit/address/:_id', userController.updateAddress)

router.post('/order/create', userController.createOrder)
router.get('/order/success', verifyLogin, userController.orderSuccess)

router.get('/user-order', verifyLogin, userController.getUserOrder)
router.put('/order/cancel/:_id', userController.cancelOrder)
router.put('/order/return/:_id', userController.returnOrder)
router.get('/view-order/:_id', verifyLogin, userController.viewUserOrder)

router.get('/user-coupon', verifyLogin, userController.getCouponpage)
router.post('/coupon', userController.applyCoupon)
//= ============================Coupon Feature===========================================//

router.post('/search', userController.searchProducts)
module.exports = router
