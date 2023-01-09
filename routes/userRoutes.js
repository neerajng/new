const router= require('express').Router();
const {getSignup,postSignup,getLogin,postLogin,getShop, logout,
    otp, forgotPass} = require('../controllers/userController');

router.route('/signup').get(checkNotAuthenticated,getSignup).post(checkNotAuthenticated,postSignup)
router.route('/login').get(checkNotAuthenticated,getLogin).post(checkNotAuthenticated,postLogin)
router.route('/').get(checkAuthenticated,getShop)
router.route('/logout').delete(logout)


router.route('/forgot').get(forgotPass).post(otp)


function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/user/login')
}


function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/user/')
    }
    next();
}


module.exports = router;