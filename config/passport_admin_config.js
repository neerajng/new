const LocalStrategy = require('passport-local').Strategy

function initialize(passport , getAdminByEmail, getAdminById){
    const  authenticateAdmin = async (email, password, done)=>{
        const admin =  await getAdminByEmail(email);
       console.log(admin);
        if(admin==null){            
            return done(null, false ,{message:'No Admin with that email'})
        } 
        try {             
            const isMatch = (password===admin.password);        
            if(isMatch){
                return done(null, admin)
            }else{
                return done(null, false ,{message:'Admin Password incorrect'})
            }
        }catch (e){            
            return done(e)
        }
    }
    passport.use('admin-local',new LocalStrategy({usernameField: 'admin_email' },authenticateAdmin))
    passport.serializeUser((admin,done)=>done(null,admin.id))
    passport.deserializeUser((id,done)=>{
        return done(null,getAdminById(id))
    }) 
}       

module.exports = {initialize};