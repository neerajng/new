
let datatable= document.getElementById("datatable")
if(datatable){
    console.log("working1")
 datatable.addEventListener('click', (e)=>{
    console.log(e.target.classList.contains('delete-cat'))
    if(e.target.classList.contains('delete-cat')){
        deletecat(e)
        console.log("working3")
    }
 })   
}

async function deletecat(e){
    console.log(e)
    console.log("working2")
    const data=e.target.dataset.url
    console.log(data)
    const url = 'http://localhost:3000/admin/category/delete/'+data
    console.log(url)
    const id=`${data}`

    fetch(url,{
        method:'DELETE',
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