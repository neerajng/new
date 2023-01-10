const router= require('express').Router();
const {getSignup,postSignup,getLogin,postLogin,getShop, logout,
otp, forgotPass} = require('../controllers/userController');
const {checkNotAuthenticated,checkAuthenticated} = require('../middlewares/user_auth_mware');

router.route('/signup').get(checkNotAuthenticated,getSignup).post(checkNotAuthenticated,postSignup)
router.route('/login').get(checkNotAuthenticated,getLogin).post(checkNotAuthenticated,postLogin)
router.route('/').get(checkAuthenticated,getShop)
router.route('/logout').delete(logout)


router.route('/forgot').get(forgotPass).post(otp);

module.exports = router;