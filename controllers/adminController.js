
const passport = require('passport')
const initializePassport = require('../config/passport-config'); 

//Login
const getLogin = (req,res) =>{ 
    res.render('adminLogin') 
}
const postLogin = passport.authenticate('local',{
    successRedirect: '/admin/',
    failureRedirect: '/admin/login',
    failureFlash: true
})    

module.exports = { getLogin, postLogin}