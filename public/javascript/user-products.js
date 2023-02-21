
/* eslint-disable no-unused-vars */
async function searchProducts (e) {
  console.log('search fnctn works!!')
  const url = '/search'
  console.log(url)
  const input = document.getElementById('search-input')
  const data = { input: input.value }
  console.log(data)

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
