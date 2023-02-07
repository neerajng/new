// import Chart from 'chart.js/auto'

getChart()
async function getChart() {
    const url = ` http://localhost:3000/admin/chart`;
    console.log(url);
    console.log('getchart() works!!');

    const res = await fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // console.log('res req sent to contrller');
    const chartData = await res.json();
    console.log(chartData);

    //product data from controller
    new Chart(
        document.getElementById('products'),
        {
            type: 'bar',
            data: {
                labels: chartData.productWiseSale.map(row => row._id),
                datasets: [
                    {
                        label: 'TOTAL PRODUCT WISE SALE',
                        data: chartData.productWiseSale.map(row => row.totalAmount),
                        backgroundColor: '#9BD0F5',
                    }
                ]
            }
        }
    )
    console.log('chart worked!');
}
