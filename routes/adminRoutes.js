const router= require('express').Router();
const {getLogin,postLogin} = require('../controllers/adminController');

router.route('/login').get(checkNotAuthenticated,getLogin).post(checkNotAuthenticated,postLogin)

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/admin/login')
}


function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/admin/')
    }
    next();
}

module.exports = router;