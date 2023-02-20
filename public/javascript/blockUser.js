const datatable = document.getElementById('datatable')
if (datatable) {
  console.log('working1')
  datatable.addEventListener('click', (e) => {
    console.log(e.target.classList.contains('block'))
    if (e.target.classList.contains('block')) {
      blockUser(e)
      console.log('working4')
    }
  })
}

async function blockUser (e) {
  console.log(e)
  console.log('working3')
  const data = e.target.dataset.url
  console.log(data)
  const url = '/admin/users/block/' + data
  console.log(url)
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
