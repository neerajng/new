const basepath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
async function cancelOrder(e) {
    console.log('ko')
    const id = await e.target.dataset.url
    const url = `${basepath}/admin/admin-order-cancel/${id}`;
    console.log(url)
    alert('are you sure to cancel the order ? ')
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