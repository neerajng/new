/* eslint-disable no-unused-vars */
/* eslint-disable indent */

// admin delivers order
async function deliverOrder (e) {
  const orderId = await e.target.dataset.url
  const url = `/admin/admin-deliver-order/${orderId}`
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

// admin cancels order
async function cancelOrder (e) {
  const id = await e.target.dataset.url
  const url = `/admin/admin-order-cancel/${id}`
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

async function returnOrder (e) {
  const orderId = await e.target.dataset.url
  const url = `/admin/admin-return-order/${orderId}`
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
