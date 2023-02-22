/* eslint-disable no-unused-vars */
const basepath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
// addToCart
async function addToCart (event) {
  event.preventDefault()
  const id = await event.target.dataset.url
  const url = `${basepath}/add-to-cart/${id}`

  await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id: id })
  })
    .then(response => { response.json() })
    .then(response => {
      const toastTrigger = document.getElementById(`liveToastBtn-${id}`)
      const toastLiveExample = document.getElementById('liveToast')
      // eslint-disable-next-line no-undef
      const toast = new bootstrap.Toast(toastLiveExample)
      toast.show()
    })
}

// incBtn
async function incBtn (event) {
  event.preventDefault()
  const productId = await event.target.dataset.url
  const url = `${basepath}/inc/${productId}`
  await fetch(url, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(response => {
      window.location.href = response.redirect
    })
}

// decBtn
async function decBtn (event) {
  const productId = await event.target.dataset.url
  const url = `${basepath}/dec/${productId}`
  await fetch(url, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(response => {
      window.location.href = response.redirect
    })
}

// deleteCart
async function deleteCart (e) {
  const id = e.target.dataset.url
  const url = `${basepath}/delete/${id}`
  await fetch(url, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(response => {
      window.location.href = response.redirect
    })
}
