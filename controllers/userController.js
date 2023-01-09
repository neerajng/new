const { Signup, Login } = require('../model/model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('../config/passport-config');

//initializePassport
initializePassport(
    passport,
    email => Signup.findOne({ email: email }),
    id => Signup.findOne({ _id: id })
)

//signup
const getSignup = (req, res) => {
    res.render('userSignup')
}
const postSignup = async (req, res) => {
    try {
        var userk = new Signup({ //storind data in mongodb
            name: req.body.fname + ' ' + req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        });

        userk.save((err) => {
            if (err) {
                console.error(err);
                res.redirect('/user/signup')
            } else {
                console.log('User saved to the database');
                res.redirect('/user/login')
            }
        });

    } catch {
        res.redirect('/user/signup')
    }
    console.log(userk)
}


//Login
const getLogin = (req, res) => {
    res.render('userLogin')
}
const postLogin = passport.authenticate('local', {
    successRedirect: '/user/',
    failureRedirect: '/user/login',
    failureFlash: true
})

//shop 
const getShop = async (req, res) => {
    var user = await req.user
    res.render('userShop', { name: user.name })
}
//logout 
const logout = (req, res) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/user/login');
    });
}




//user otp
const otp = (req, res) => {
    res.render('otp')
}
//user forget password
const forgotPass = (req, res) => {
    res.render('forgotPass')
}



module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    getShop,
    logout,

    otp, forgotPass,
}