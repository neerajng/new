module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.session.auth) {
      next()
    } else {
      res.redirect('/login')
    }
  },

  isLoggedOut: (req, res, next) => {
    if (!req.session.auth) {
      next()
    } else {
      res.redirect('/home')
    }
  }
}
