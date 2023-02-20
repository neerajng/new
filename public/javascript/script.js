/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */

function signup () {
  console.log('signup')
  const fname = document.getElementById('fname').value
  const lname = document.getElementById('lname').value

  const email = document.getElementById('email').value
  // eslint-disable-next-line no-useless-escape
  const mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/

  const phone = document.getElementById('phone').value
  const phoneformat = /^\d{10}$/

  const password1 = document.getElementById('password1').value
  const password2 = document.getElementById('password2').value

  const err = document.querySelector('#error')
  let text
  if (fname === '') {
    text = 'Please enter the First Name'
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else if (lname === '') {
    text = 'Please enter the Last Name'
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else if (email === '' || email.match(mailformat) === null) {
    text = 'Please enter a valid Email'
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else if (phone === '' || phone.match(phoneformat) === null) {
    text = 'Please enter a valid Phone number'
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else if (password1.length <= 4) {
    text = 'Please enter a strong password '
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else if (password1 !== password2) {
    text = 'Passwords should be matched'
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else {
    return true
  }
}

function login () {
  const email = document.getElementById('email').value
  const mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/

  const password = document.getElementById('password').value
  const err = document.querySelector('#loginerror')
  let text

  if (email === '' || email.match(mailformat) === null) {
    text = 'Please enter a valid Email'
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else if (password.length <= 4) {
    text = 'Please enter a strong password '
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else {
    return true
  }
}

function adminlogin () {
  const email = document.getElementById('email').value
  const passord = document.getElementById('password').value
  const err = document.querySelector('#error_L')

  if (email !== 'neerajng@gmail.com' || passord !== 'admin') {
    const text = 'Incorrect Admin Credentials'
    err.textContent = text
    err.style.height = '2rem'
    return false
  } else {
    return true
  }
}
