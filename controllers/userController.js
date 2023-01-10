const { Signup } = require('../model/model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const {initialize} = require('../config/passport-config');

initialize(
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
        var user = new Signup({ //storind data in mongodb
            name: req.body.fname + ' ' + req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        });

        user.save((err) => {
            if (err) {
                console.error(err);
                res.redirect('/signup')
            } else {
                console.log('User saved to the database');
                res.redirect('/login')
            }
        });

    } catch {
        res.redirect('/signup')
    }
    console.log(user)
}


//Login
const getLogin = (req, res) => {
    res.render('userLogin')
}
const postLogin = passport.authenticate('user-local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})

//shop 
const getShop = async (req, res) => {
    
    res.render('userShop',)
}
//logout 
const logout = (req, res) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
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