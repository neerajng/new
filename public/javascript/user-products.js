
/* eslint-disable no-unused-vars */
async function searchProducts (e) {
  const url = '/search'
  const input = document.getElementById('search-input')
  const data = { input: input.value }
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const redirectPath = await res.json()
  window.location.href = redirectPath.redirect
}
