
const { Admin } = require('../model/model')
const passport = require('passport')
const {initialize} = require('../config/passport_admin_config'); 

// let admins=[{email : 'neerajng@gmail.com' ,password:"admin",id:Date.now().toString()+Date.now().toString()}]
initialize(
    passport,
    email => Admin.findOne({ email: email }),
    id => Admin.findOne({ _id: id })
)

//Login
const getLogin = (req,res) =>{ 
    res.render('adminLogin') 
}
const postLogin = passport.authenticate('admin-local',{
    successRedirect: '/admin/',
    failureRedirect: '/admin/login',
    failureFlash: true
})    

//getAdminpanel
const getPanel = async (req, res) => {
    var admin = await req.admin;
    res.render('adminPanel')
}

module.exports = { getLogin, postLogin, getPanel}