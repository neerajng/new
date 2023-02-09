const basepath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
async function couponActivate(e) {
    alert('are you sure ?')
    console.log('coupon fn working');
    const couponId = e.target.dataset.url;
    console.log(couponId);
    const url = `${basepath}/admin/updatecoupon/${couponId}`;
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}