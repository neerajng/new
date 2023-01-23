

function signup(){
console.log("signup");
var fname = document.getElementById("fname").value
var lname = document.getElementById("lname").value

var email = document.getElementById("email").value
var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

var phone = document.getElementById("phone").value
var phoneformat= /^\d{10}$/;

var password1 = document.getElementById("password1").value
var password2 = document.getElementById("password2").value

var err = document.querySelector('#error')
var text;
if(fname === ''){
    text = "Please enter the First Name";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else if(lname === ''){
    text = "Please enter the Last Name";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else if(email === '' || email.match(mailformat) === null){
    text = "Please enter a valid Email";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else if(phone === '' || phone.match(phoneformat)=== null){
    text = "Please enter a valid Phone number";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else if (password1.length <=4) {
    text = "Please enter a strong password ";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else if (password1!=password2) {   
    text = "Passwords should be matched";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else{
    return true;
}

}



function login(){

var email = document.getElementById("email").value
var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

var password = document.getElementById("password").value
var err = document.querySelector('#loginerror')
var text;

if(email === '' || email.match(mailformat) === null){
    text = "Please enter a valid Email";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else if (password.length <=4) {
    text = "Please enter a strong password ";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
}else{
    return true;
}

}

function adminlogin(){    
    var email = document.getElementById("email").value
    var passord = document.getElementById("password").value
    var err = document.querySelector('#error_L')

    if(email !== 'neerajng@gmail.com' || passord !=="admin"){
    var text = "Incorrect Admin Credentials";
    err.textContent = text;
    err.style.height = '2rem';
    return false;
    }else{
        return true;
    }    

}

