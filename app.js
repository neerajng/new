const express = require('express')
const session = require('express-session')
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const connectDB = require('./config/connect')
const MongoStore = require('connect-mongo')
const hbs = require('express-handlebars')
const path = require('path')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 3000
const oneDay = 60 * 60 * 24 * 1000

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// root setup for hbs
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./config/hbs-helpers')
})
)
hbs.create().getPartials().then(function (partials) { })

app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
  next()
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  dbName: 'Shopwine',
  collectionName: 'sessions'
})

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
  store: sessionStore
}))

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()

// routes
app.use('/', userRouter)
app.use('/admin', adminRouter)

// 404 error handler
app.use((req, res, next) => {
  res.status(404).render('page-not-found')
})
