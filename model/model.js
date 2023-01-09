const mongoose= require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const signupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
        type: String,
        required: true,
    }
})
signupSchema.plugin(passportLocalMongoose);

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
}

})    


const Signup = mongoose.model('Signup', signupSchema);
const Login = mongoose.model('Login', loginSchema);

module.exports={Signup,Login};