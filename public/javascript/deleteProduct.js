const datatable = document.getElementById('datatable')
if (datatable) {
  datatable.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-prod')) {
      deleteprod(e)
    }
  })
}

async function deleteprod (e) {
  const data = e.target.dataset.url
  const url = '/admin/products/delete/' + data
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
