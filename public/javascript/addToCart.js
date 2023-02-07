const basepath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
///addToCart
async function addToCart(event) {
    event.preventDefault()
    id = await event.target.dataset.url
    const url = `${basepath}/add-to-cart/${id}`
    console.log(url);

    await fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: id })
    })
        .then(response => { response.json() })
        .then(response => {            
            const toastTrigger = document.getElementById(`liveToastBtn-${id}`)
            console.log(toastTrigger);
            const toastLiveExample = document.getElementById('liveToast')
            const toast = new bootstrap.Toast(toastLiveExample)
            toast.show()
        })
}



///incBtn
async function incBtn(event) {
    event.preventDefault()
    const productId = await event.target.dataset.url;
    console.log(productId);
    const url = `${basepath}/inc/${productId}`;
    console.log(url);
    await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log("working100")
            window.location.href = response.redirect
        })
}



///decBtn
async function decBtn(event) {
    console.log('decrement fetch works!!');
    const productId = await event.target.dataset.url;
    console.log(productId);
    const url = `${basepath}/dec/${productId}`;
    console.log(url);
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log("working100")
            window.location.href = response.redirect
        })
}



///deleteCart
async function deleteCart(e) {
    console.log('Delete');
    const id = e.target.dataset.url;
    console.log(id);
    const url = `${basepath}/delete/${id}`;
    console.log(url);
    const res = await fetch(url, {
        method: 'DELETE',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log("working100")
            window.location.href = response.redirect
        })
}    