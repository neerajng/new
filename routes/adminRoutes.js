const router= require('express').Router();
const {getLogin,postLogin, getPanel} = require('../controllers/adminController');
const {checkNotAuthenticated,checkAuthenticated}=require('../middlewares/admin_auth_mware')

router.route('/login').get(checkNotAuthenticated,getLogin).post(checkNotAuthenticated,postLogin)
router.route('/').get(checkAuthenticated,getPanel)



module.exports = router;