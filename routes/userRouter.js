const express = require('express')
const userController = require('../controllers/userController');
const userAuth = require('../middlewares/users')
const router = express.Router();

router.get('/', userAuth.isLoggedOut, userController.getLanding)
router.get('/home', userAuth.isLoggedIn, userController.getHomepage)
router.get('/register', userAuth.isLoggedOut, userController.getRegister)
router.get('/otp', userAuth.isLoggedOut, userController.getRegisterOtp)
router.get('/login', userAuth.isLoggedOut, userController.getLogin)
router.get('/forgot', userAuth.isLoggedOut, userController.getForgotpass)//to enter phone
router.get('/forgotOtp', userAuth.isLoggedOut, userController.getForgotPassOtp)
router.get('/changepass', userAuth.isLoggedOut, userController.getChangePass)
router.get('/singleProduct/:_id', userAuth.isLoggedIn, userController.getSingleProduct)
router.get('/logout', userAuth.isLoggedIn, userController.logoutUser)
//------------------------get routes----------------------------//

router.post('/register', userController.existUser, userController.generateOtp)
router.post('/otp', userController.checkOtp)
router.post('/login', userController.loginUser)
router.post('/forgot', userController.fetchOtp, userController.generateOtp)//phone format=>otp enter page,otp&phone@session
router.post('/forgotOtp', userController.changepass)//submit_otp_page,got_changepass_page
router.post('/changepass', userController.changed)//submit_changepass_page,checks_phone_in_db->

//=============================Cart Feature===========================================//
router.get('/getcart', userAuth.isLoggedIn, userController.getCart)
router.post('/add-to-cart/:_id',userAuth.isLoggedIn,userController.addToCart)
router.put('/inc/:_id' , userAuth.isLoggedIn, userController.increment);
router.put('/dec/:_id' , userAuth.isLoggedIn, userController.decrement);
router.delete('/delete/:_id' , userAuth.isLoggedIn , userController.deleteCart);

//=============================Order Feature===========================================//
router.get('/checkout', userAuth.isLoggedIn, userController.getOrder)
router.post('/order/address/:_id' , userController.newShippingAddress)
router.post('/order/create',userController.createOrder )  
router.get('/order/success',userAuth.isLoggedIn,userController.orderSuccess)
router.get('/order/user-order',userAuth.isLoggedIn,userController.getUserOrder)
router.put('/order/cancel/:_id' ,userController.cancelOrder);

router.get('/user-coupon', userAuth.isLoggedIn, userController.getCouponpage)
router.post('/coupon',userController.applyCoupon)
//=============================Coupon Feature===========================================//


module.exports = router;