/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */

let products = ''
// category wise filteration
// const categoryContainer = document.querySelector('.btn-container-product')
// categoryContainer.addEventListener('click', (e) => {
//   if (e.target.classList.contains('category')) {
//     document.querySelector('.search-product').value = ''
//     document.querySelector('.minPrice').value = ''
//     document.querySelector('.maxPrice').value = ''
//     getProductByCategory(e)
//   }
// })

async function getProductByCategory (e) {
  document.querySelector('.search-product').value = ''
  const category = e.target.dataset.url
  const url = `/category/${category}`
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  products = await res.json()

  const productListContainer = document.querySelector('.best-products-list')
  productListContainer.innerHTML = ''
  products.products.forEach((product) => {
    const productContent = `<div class="product-card">
                                    <img src="${product.images[0].secured_url}" alt="best">
                                    <h2 class="product_name">${product.productName}</h2>
                                    <h3 class="price">₹${product.price}</h3>
                                    <a href="/cart/${product._id}" class="btn-add-cart">
                                        Add to Cart
                                    </a>
                                    <a href="/product/${product._id}" class="btn-view-product">
                                        View Product
                                    </a>  
                                 </div>`

    productListContainer.innerHTML = productListContainer.innerHTML + productContent
  })
}

// // filter by product name
// const productSearchForm = document.querySelector('.search')
// productSearchForm.addEventListener('submit', (e) => {
//   e.preventDefault()
//   document.querySelector('.minPrice').value = ''
//   document.querySelector('.maxPrice').value = ''
//   getProductByName()
// })
// async function getProductByName () {
//   const url = '/product/search'
//   const res = await fetch(url, {
//     method: 'POST',
//     credentials: 'same-origin',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       productName: document.querySelector('.search-product').value
//     })
//   })
//   products = await res.json()
//   // console.log(products);
//   const productListContainer = document.querySelector('.best-products-list')
//   productListContainer.innerHTML = ''
//   if (products.products.length === 0) {
//     productListContainer.innerHTML = `<div class='empty-product'>
//                 <h1>Can't find any product with this name</h1>
//                 <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_a3axagh3.json" background="transparent"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>             
//         </div>`
//   }
//   products.products.forEach((product) => {
//     const productContent = `<div class="product-card">
//                                     <img src="${product.images[0].secured_url}" alt="best">
//                                     <h2 class="product_name">${product.productName}</h2>
//                                     <h3 class="price">₹${product.price}</h3>
//                                     <a href="/cart/${product._id}" class="btn-add-cart">
//                                         Add to Cart
//                                     </a>
//                                     <a href="/product/${product._id}" class="btn-view-product">
//                                         View Product
//                                     </a>  
//                                  </div>`

//     productListContainer.innerHTML = productListContainer.innerHTML + productContent
//   })

//   // window.location.href = redirectPath.redirect;
// }

// // filter by price
// const priceFilterForm = document.querySelector('.price_filter')
// priceFilterForm.addEventListener('submit', (e) => {
//   e.preventDefault()
//   filterProductByPrice()
// })
// async function filterProductByPrice () {
//   if (products !== '') {
//     const minPrice = document.querySelector('.minPrice').value
//     const maxPrice = document.querySelector('.maxPrice').value
//     if (minPrice === '' && maxPrice === '') {
//       const url = '/product/price'
//       const res = await fetch(url, {
//         method: 'POST',
//         credentials: 'same-origin',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           min: document.querySelector('.minPrice').value,
//           max: document.querySelector('.maxPrice').value
//         })
//       })
//       products = await res.json()
//     } else if (minPrice !== '' && maxPrice === '') {
//       products.products = products.products.filter((item) => {
//         if (item.price >= minPrice) {
//           return item
//         }
//       })
//     } else if (minPrice === '' && maxPrice !== '') {
//       products.products = products.products.filter((item) => {
//         if (item.price <= maxPrice) {
//           return item
//         }
//       })
//     } else if (minPrice !== '' && maxPrice !== '') {
//       products.products = products.products.filter((item) => {
//         if (item.price >= minPrice && item.price <= maxPrice) {
//           return item
//         }
//       })
//     }

//     const productListContainer = document.querySelector('.best-products-list')
//     productListContainer.innerHTML = ''
//     if (products.products.length === 0) {
//       productListContainer.innerHTML = `<div class='empty-product'>
//                     <h1>Can't find any product with this name</h1>
//                     <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_a3axagh3.json" background="transparent"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>             
//             </div>`
//     }
//     products.products.forEach((product) => {
//       const productContent = `<div class="product-card">
//                                     <img src="${product.images[0].secured_url}" alt="best">
//                                     <h2 class="product_name">${product.productName}</h2>
//                                     <h3 class="price">₹${product.price}</h3>
//                                     <a href="/cart/${product._id}" class="btn-add-cart">
//                                         Add to Cart
//                                     </a>
//                                     <a href="/product/${product._id}" class="btn-view-product">
//                                         View Product
//                                     </a>  
//                                  </div>`

//       productListContainer.innerHTML = productListContainer.innerHTML + productContent
//     })
//   } else {
//     const url = '/product/price'
//     const res = await fetch(url, {
//       method: 'POST',
//       credentials: 'same-origin',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         min: document.querySelector('.minPrice').value,
//         max: document.querySelector('.maxPrice').value
//       })
//     })
//     products = await res.json()
//     const productListContainer = document.querySelector('.best-products-list')
//     productListContainer.innerHTML = ''
//     products.products.forEach((product) => {
//       const productContent = `<div class="product-card">
//                                         <img src="${product.images[0].secured_url}" alt="best">
//                                         <h2 class="product_name">${product.productName}</h2>
//                                         <h3 class="price">₹${product.price}</h3>
//                                         <a href="/cart/${product._id}" class="btn-add-cart">
//                                             Add to Cart
//                                         </a>
//                                         <a href="/product/${product._id}" class="btn-view-product">
//                                             View Product
//                                         </a>  
//                                     </div>`

//       productListContainer.innerHTML = productListContainer.innerHTML + productContent
//     })
//   }
// }
