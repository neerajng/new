const express = require('express')
const userController = require('../controllers/userController');
const userAuth=require('../auth/users')
const router= express.Router();

router.get('/',userAuth.isLoggedOut,userController.getLanding)

router.get('/home',userAuth.isLoggedIn,userController.getHomepage)

router.get('/register',userAuth.isLoggedOut,userController.getRegister)
router.get('/otp',userAuth.isLoggedOut,userController.getRegisterOtp)

router.get('/login',userAuth.isLoggedOut,userController.getLogin)

router.get('/forgot',userAuth.isLoggedOut,userController.getForgotpass)//to enter phone
router.get('/forgot_otp',userAuth.isLoggedOut,userController.getForgotPassOtp)
router.get('/changepass',userAuth.isLoggedOut,userController.getChangePass)
router.get('/logout',userAuth.isLoggedIn,userController.logoutUser)
//------------------------get routes----------------------------//


router.post('/register', userController.existUser,userController.generateOtp)
router.post('/otp', userController.checkOtp)
router.post('/login',userController.loginUser)
router.post('/forgot',userController.fetchOtp ,userController.generateOtp)//phone format=>otp enter page,otp&phone@session
router.post('/forgot_otp', userController.changepass)//submit_otp_page,got_changepass_page
router.post('/changepass',userController.changed)//submit_changepass_page,checks_phone_in_db->

module.exports =router;