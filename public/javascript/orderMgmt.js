/* eslint-disable no-unused-vars */

// user cancels the order
async function cancelOrder (e) {
  const orderId = e.target.dataset.url
  const url = `/order/cancel/${orderId}`
  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const redirectPath = await res.json()
  window.location.href = redirectPath.redirect
}

// user returns order
async function returnOrder (e) {
  const orderId = e.target.dataset.url
  const url = `/order/return/${orderId}`
  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const redirectPath = await res.json()
  window.location.href = redirectPath.redirect
}
