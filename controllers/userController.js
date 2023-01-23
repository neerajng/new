const session = require('express-session')
const { User } = require('../model/users')
const {Product} =require('../model/product')
// const bcrypt = require('bcrypt')
const fast2sms = require('fast-two-sms')
const bcrypt = require('bcrypt')
const axios = require('axios')
require('dotenv').config()


module.exports = { 
  getHomepage: async (req,res)=>{
    const product= await Product.find()
    console.log(req.session.user)
    return res.render('home-page',{product})
    },
  getRegister:(req,res)=>{ 
    if(req.session.message){
      const message=req.session.message
      req.session.message=null
      return res.render('register',{message}) 
    }else{  
      const message='' 
    return res.render('register',{message})
    }  
    },

  getRegisterOtp: (req,res)=>{    
    return res.render('register-otp')  
  },
  getLogin:(req,res)=>{  
    if(req.session.message){
      const message=req.session.message
      req.session.message=null
      return res.render('login',{message}) 
    }else{  
      const message='' 
    return res.render('login',{message})
    }  
  }, 
  getForgotpass:(req,res)=>{    
    if(req.session.message){
      const message=req.session.message
      req.session.message=null
      return res.render('forgotPass',{message}) 
    }else{  
      const message='' 
    return res.render('forgotPass',{message})
    } 
  },
  getForgotPassOtp:(req,res)=>{    
    return res.render('forgot-otp')
  },
  getChangePass:(req,res)=>{    
    return res.render('changePass')
  },
  getLanding:(req,res)=>{   
    const landing=[  
      {img:"/images/7.jpg",price:"Rs.100",name:"Spiritual  Moment",text:"This premium vodka is smooth and perfectly blends with your senses, giving an enriched taste. "},
      {img:"/images/6.jpg",price:"Rs.800",name:"Rose Cometa",text:"A great white wine from southern Italian grapes, comparable with great white wines of the world"},
      {img:"/images/9.jpg",price:"Rs.700",name:"Chakras",text:"Chakras Cabernet Sauvignon has a ruby red color and aromas of black cherries and cassis."},
      {img:"images/4.jpg",price:"Rs.100",name:"Blue comet",text:"Chakras Cabernet Sauvignon has a ruby red color and aromas of black cherries and cassis."},
      {img:"/images/10.jpg",price:"Rs.900",name:"Orange Wine",text:"It's a type of white wine made by leaving the grape skins and seeds in contact with the juice."},
      {img:"/images/11.jpg",price:"Rs.500",name:"Djiulle Diuxe",text:"A cool drink from Lombardia, Northern Italy, Italy. Made from Merlot, Cabernet Sauvignon. "},
      {img:"/images/12.jpg",price:"Rs.200",name:"Vanishing Tides",text:" A crisp, clean, and refreshing premium lager brewed in the Czech Pilsner style."},
      {img:"/images/5.jpg",price:"Rs.600",name:"Cider Fiction",text:"The Cider Fiction, the latest cider brand from Pinnacle Drinks.It's created by a renowned winemaker"},
    ]; 
    return res.render('landing-page',{landing})
  },
  //----------------------------------------------------------------//

  
  existUser:async (req,res,next)=>{
    const existing = await User.find({$or: [{email: req.body.email}, {phone: req.body.phone}]})
    if(existing==0){
      req.session.user={
        firstname: req.body.fname,
        lastname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password1,
      }    
      next();  
      res.redirect('/otp');
      
  }else{
    req.session.message='User Already Exists'
    return res.redirect('/register')
  }
  },

  generateOtp: (req, res) => {    
  console.log('generateOtp')  
  let otp = Math.floor(100000 + Math.random()*900000)
  console.log(otp+" "+req.body.phone) ; 
  req.session.otpOne = otp;
  req.session.phone=req.body.phone
  sendOtp(otp, req.body.phone)
  },

  checkOtp: async (req, res) => {
    console.log('check otp')
    console.log(req.session);
    console.log(req.session.otpOne)
    console.log(req.body.otp)
    if(req.body.otp == req.session.otpOne){
      const user=new User( req.session.user )
      console.log(user)     
      try{
        await user.save()
        return res.redirect('/login')
      }catch(error){
        console.log(error)
        return res.redirect('/register')
      }
    }else{
      return res.json({
        message: 'Invalid OTP'
      })
    }
  },  
  fetchOtp:(req,res,next)=>{   
    console.log("forgot otp-page(enter phone number")
    const phoneformat= /^\d{10}$/;
    const phone= req.body.phone;
    console.log(phone.match(phoneformat)) 
    if(phone.match(phoneformat)){
      next()
      return res.redirect('/forgotOtp') //res.render('forgot-otp')            
    }else{
      req.session.message='Enter a valid phone number'
      return res.redirect('/forgot') // res.render('forgotPass',{message:'Enter a valid phone number'})
    }
  },
  changepass: (req, res) => {
    console.log('check otp for new password')
    console.log(req.session);
    console.log(req.session.otpOne)
    console.log(req.body.otp)
    if(req.body.otp == req.session.otpOne){      
      try{        
        return res.redirect('/changepass')// return res.render('changePass')
      }catch(error){
        console.log(error)
      }
    }else{
      return res.json({
        message: 'Invalid OTP'
      })
    }
  },
  changed:async (req, res) => {
    const existphone = await User.findOne({phone: req.session.phone}) 
    console.log(existphone)   
    if(existphone){
      try{
        const user=await User.updateOne({phone: req.session.phone}, {$set:{password:req.body.password}})   
        console.log(user)  
        req.session.password=req.body.password
        return res.redirect('/login')        
      }catch(e){
        console.error(e)
      }
    }else{
      return res.redirect('/changepass')// return res.render('changePass',{message:''})
    }
  },

  loginUser:async (req,res)=>{
  try{  
  const registeredUser = await User.findOne({email:req.body.email})
  const blocked=(registeredUser.isBlocked==true)
  console.log(registeredUser||!blocked)
  if(registeredUser&&!blocked){
    try{              
        console.log(registeredUser.email+" "+registeredUser.password)
        const pass_match =await bcrypt.compare(req.body.password, registeredUser.password)|| (req.body.password==req.session.password)
        console.log(pass_match)
        if(pass_match){
          req.session.auth=true
          return res.redirect('/home') //res.render('home-page')
        }else{
          req.session.message='You are not a registered User'
          return res.redirect('/login')// res.render('login',{message:'You are not a registered User'})
        }      
    }catch(error){
        console.log(error)
    }  
  }
  else{
    req.session.message='You have been blocked'
    return res.redirect('/login')//res.render('login',{message:'You are not a registered User'})
  }
}catch(error){
  req.session.message='No user Found'
  return res.redirect('/login')
}
},
logoutUser:(req,res)=>{
  req.session.auth=null
  res.redirect('/logout')
}
}


function sendOtp(otp, number){
  console.log('sent otp')
  console.log(otp)
  const body = {
    "authorization" : process.env.AUTHORIZATION_KEY,
    "variables_values" : otp,
    "route" : "otp",
    "numbers" : number
  }
  return axios({
    method : 'GET',
    url : 'https://www.fast2sms.com/dev/bulkV2',
    data: body
  })
}