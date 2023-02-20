
const form = document.getElementById('updateForm')

form.addEventListener('click', (e) => {
  console.log(e.target.classList.contains('update-prod'))
  if (e.target.classList.contains('update-prod')) {
    submitForm(e)
    console.log('working3')
  }
})

async function submitForm (e) {
  const data = await e.target.dataset.url
  console.log(data)
  const formData = new FormData()
  const file = document.getElementById('fileName').files[0]
  formData.append('name', document.getElementById('productname').value)
  formData.append('price', document.getElementById('price').value)
  formData.append('fileName', file)
  formData.append('description', document.getElementById('description').value)
  formData.append('category', document.getElementById('inputCat').value)
  formData.append('stock', document.getElementById('stock').value)
  const url = '/admin/products/edit/' + data

  console.log(url)
  await fetch(url, {
    method: 'PUT',
    body: formData
  })
    .then(response => response.json())
    .then(response => {
      console.log('working')
      window.location.href = response.redirect
    })
}
