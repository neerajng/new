if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express=require("express");
const app=express();
const hbs = require('express-handlebars');
const path = require('path');
const connectDB=require('./middlewares/connect')
const userRoutes=require("./routes/userRoutes")
const adminRoutes=require("./routes/adminRoutes")
const passport=require('passport');
const flash=require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

//middlewares
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false ,
    saveUninitialized:false,
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// root setup for hbs
app.engine( 'hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  })
);

//routes
app.use('/',userRoutes)
app.use('/admin',adminRoutes)

  

const port=3000;

const start= async () => {
  try{
      await connectDB(process.env.MONGO_URI);
      app.listen(port, console.log(`server is listening on port ${port}...`));
  }
  catch(error){
      console.log(error);
  }
}

start();