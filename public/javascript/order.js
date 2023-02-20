/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const codBtn = document.querySelector('.btn-cod')

if (codBtn) {
  console.log(codBtn)
  codBtn.addEventListener('click', (e) => {
    console.log('cod-click-works')
    createOrder(e)
  })
}

const razorbtn = document.querySelector('.btn-razor')
if (razorbtn) {
  console.log(razorbtn)
  razorbtn.addEventListener('click', (e) => {
    console.log('razor click works')
    createOrder(e)
  })
}

// for creating order

async function createOrder (e) {
  console.log('fun works!')
  const url = '/order/create'
  console.log(url)
  let methodofPayment
  if (e.target.classList.contains('btn-cod')) {
    console.log('if works!!')
    methodofPayment = 'cash on delivery'
  } else if (e.target.classList.contains('btn-razor')) {
    console.log('razor else works!!')
    methodofPayment = 'Razor pay'
  }
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      totalAmount: document.querySelector('.order-price').textContent,
      paymentMethod: methodofPayment,
      orderStatus: 'placed order',
      shippingInfo: document.querySelector('input[name="address"]:checked').value
    })
  })
  const redirectPath = await res.json()
  console.log(redirectPath)
  if (redirectPath.myOrder) {
    console.log(' response redirecting works!!')
    const options = {
      key: 'rzp_test_eggyFCs0RAH55e', // Key ID
      amount: redirectPath.myOrder.amount * 100, // Amount is in paise
      currency: 'INR',
      order_id: redirectPath.myOrder.id, // This is a sample Order ID
      handler: function () {
        window.location.href = redirectPath.redirect
      }
    }
    console.log(options)
    const rzp1 = new Razorpay(options)
    rzp1.open()
    e.preventDefault()
  } else {
    console.log('Y')
    window.location.href = redirectPath.redirect
  }
}

// edit address
async function editAddress (e) {
  const addressId = await e.target.dataset.url
  console.log(addressId)
  const formData = new FormData()
  formData.append('houseName', document.getElementById('houseName').value)
  formData.append('phone', document.getElementById('phone').value)
  formData.append('city', document.getElementById('city').value)
  formData.append('postalCode', document.getElementById('postalCode').value)
  formData.append('state', document.getElementById('state').value)
  formData.append('country', document.getElementById('country').value)
  const url = '/edit/address/' + addressId
  const object = {}
  formData.forEach((value, key) => object[key] = value)
  const json = JSON.stringify(object)
  await fetch(url, {
    method: 'PUT',
    body: json,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(response => {
      console.log('working')
      window.location.href = response.redirect
    })
}
