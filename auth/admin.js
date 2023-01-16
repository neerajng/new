module.exports={
    isLoggedIn : (req, res, next) => {
         if (req.session.admin) {
           next()
         } else {
           res.redirect('/admin/login')
         }
       },
 
      isLoggedOut :(req, res, next) => {
         if (!req.session.admin) {
           next()
         } else {
           res.redirect('/admin/home')
         }
       }
 }