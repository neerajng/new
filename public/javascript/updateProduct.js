
const form = document.getElementById("updateForm");

form.addEventListener('click', (e)=>{
    console.log(e.target.classList.contains('update-prod'))
    if(e.target.classList.contains('update-prod')){
        submitForm(e)
        console.log("working3")
    }
 })

async function submitForm(e){        
    const data=await e.target.dataset.url
    console.log(data)
    const formData =  new FormData();
    const file = document.getElementById("fileName").files[0];
    formData.append("name", document.getElementById("productname").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("fileName", file);
    formData.append("description", document.getElementById("description").value);
    formData.append("category", document.getElementById("inputCat").value);     
    const url = 'http://localhost:3000/admin/products/edit/'+data  

    console.log(url);
    await fetch(url,{
        method:'PUT',
        body: formData                    
    })
    .then(response => response.json())
    .then(response=>{
        console.log("working")
        window.location.href=response.redirect
    })
}    





// let formUpdate= document.getElementById("formUpdate")
// if(formUpdate){
//     console.log("formUpdate")
//     formUpdate.addEventListener('click', (e)=>{
//     console.log(e.target.classList.contains('update-prod'))
//     if(e.target.classList.contains('update-prod')){
//         updateprod(e)
//         console.log("working3")
//     }
//  })   
// }

// async function updateprod(id){
//     console.log(id)   
//     const formData =  new FormData();
//     formData.append("name", document.getElementById("productname").value);
//     formData.append("price", document.getElementById("price").value);
//     formData.append("fileName", document.getElementById("fileName").value);
//     formData.append("description", document.getElementById("description").value);
//     formData.append("category", document.getElementById("inputCat").value);
//     const url = 'http://localhost:3000/admin/products/edit/'+id
//     console.log(url)  
    
//     await fetch(url,{
//         method:'PUT',              
//         body: formData      
//     })
//     .then(response => response.json())
//     .then(response=>{
//         console.log("working2")
//         window.location.href=response.redirect
//     })
    
// }
