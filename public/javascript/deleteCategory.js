/* eslint-disable */
const basepath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
async function deletecat (e) {
  e.preventDefault()
  const id = e.target.dataset.url
  const url = `${basepath}/admin/category/delete/${id}`

  fetch(url, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id: id })
  })
    .then(response => response.json())
    .then(response => {
      window.location.href = response.redirect
    })
}
