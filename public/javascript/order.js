let codBtn = document.querySelector('.btn-cod');

if (codBtn) {
    console.log(codBtn)
    codBtn.addEventListener('click', (e) => {
        console.log('cod-click-works')
        createOrder(e);
    })
}

let razorbtn = document.querySelector('.btn-razor')
if (razorbtn) {
    console.log(razorbtn)
    razorbtn.addEventListener('click', (e) => {
        console.log('razor click works')
        createOrder(e);
    })
}

//for creating order

async function createOrder(e) {
    console.log('fun works!');
    const url = `http://localhost:3000/order/create`;
    console.log(url);
    let methodofPayment;
    if (e.target.classList.contains('btn-cod')) {
        console.log('if works!!');
        methodofPayment = 'cash on delivery'
    } else if (e.target.classList.contains('btn-razor')) {
        console.log('razor else works!!');
        methodofPayment = 'Razor pay'
    }
    const res = await fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            totalAmount: document.querySelector('.order-price').textContent,
            paymentMethod: methodofPayment,
            orderStatus: 'placed order',
            shippingInfo: document.querySelector('input[name="address"]:checked').value
        })
    })
    const redirectPath = await res.json()
    console.log(redirectPath);
    if (redirectPath.myOrder) {
        console.log(' response redirecting works!!');
        // console.log(redirectPath.myOrder)
        var options = {
            key: "rzp_test_eggyFCs0RAH55e", // Key ID
            amount: redirectPath.myOrder.amount *100, // Amount is in paise
            currency: "INR",
            order_id: redirectPath.myOrder.id, //This is a sample Order ID
            handler: function() {
                window.location.href = redirectPath.redirect;
            }
        };
        console.log(options);
        var rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

    } else {
        console.log('Y');
        window.location.href = redirectPath.redirect;  
    }
     
}

//for cancelleing order

let orderContainer = document.querySelector('.userorder-container');
if (orderContainer) {
    orderContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('order-cancel-btn')) {
            removeOrder(e);
        }
    })
}

async function removeOrder(e) {
    const orderId = e.target.dataset.url
    // console.log(orderId)
    const url = `http://localhost:3000/order/cancel/${orderId}`;
    // console.log(url)
    alert('Are you sure that you want to cancel the order ? ')
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect
}