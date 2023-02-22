const datatable = document.getElementById('datatable')
if (datatable) {
  datatable.addEventListener('click', (e) => {
    if (e.target.classList.contains('block')) {
      blockUser(e)
    }
  })
}

async function blockUser (e) {
  const data = e.target.dataset.url
  const url = '/admin/users/block/' + data
  const id = `${data}`

  fetch(url, {
    method: 'PUT',
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
