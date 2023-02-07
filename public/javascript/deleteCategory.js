const basepath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
async function deletecat(e){
    e.preventDefault()
    console.log(e)
    console.log("working")
    const id=e.target.dataset.url
    const url = `${basepath}/admin/category/delete/${id}`
    console.log(url)   

    fetch(url,{
        method:'PUT',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id:id})
    })
    .then(response => response.json())
    .then(response=>{
        console.log("wokin100")
        window.location.href=response.redirect
    })
    
}