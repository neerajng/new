async function addToCart(event){
    event.preventDefault()
    id=await event.target.dataset.url 
    const toastTrigger = document.getElementById(`liveToastBtn-${id}`)
    console.log(toastTrigger);
    const toastLiveExample = document.getElementById('liveToast')
    if (toastTrigger) {
        toastTrigger.addEventListener('click', () => {
            const toast = new bootstrap.Toast(toastLiveExample)
            toast.show()
        })
    }
    const url = `http://localhost:3000/add-to-cart/${id}`               
    console.log(url);

    fetch(url,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id:id})
    })
    .then(response => {
        response.json()
        console.log(response)
    })
}

async function incBtn(event) {
    event.preventDefault()
    const productId = await event.target.dataset.url;
    console.log(productId);
    const url = `http://localhost:3000/inc/${productId}` ;
    console.log(url);
    await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
        'Content-Type' : 'application/json'
        }
    })  
    .then(response => response.json())
    .then(response=>{
        console.log("working100")
        window.location.href=response.redirect
    })
}


async function decBtn(event) {
    console.log('decrement fetch works!!');
    const productId = await event.target.dataset.url;
    console.log(productId);
    const url = `http://localhost:3000/dec/${productId}` ;
    console.log(url);
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
        'Content-Type' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(response=>{
        console.log("working100")
        window.location.href=response.redirect
    })
}             
///delete
async function deleteCart(e){
    console.log('Delete');
    const id = e.target.dataset.url;
    console.log(id);
    const url = `http://localhost:3000/delete/${id}` ;
    console.log(url);
    const res = await fetch(url, {
        method: 'DELETE',
        credentials: "same-origin",
        headers: {
        'Content-Type' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(response=>{
        console.log("working100")
        window.location.href=response.redirect
    })
}    