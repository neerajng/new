/* eslint-disable */
// import Chart from 'chart.js/auto'

getChart()
async function getChart() {
  const url = '/admin/chart'
  console.log(url)
  console.log('getchart() works!!')

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  // console.log('res req sent to contrller');
  const chartData = await res.json()
  console.log(chartData)

  // product data from controller
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
            backgroundColor: 
            ["#581845", "#8e5ea2", "#3cba9f", "#FFC300", "#c45850"
            , "#8e5ea2", "#3cba9f", "#FFC300", "#c45850"
            , "#8e5ea2", "#3cba9f", "#FFC300", "#c45850"
            , "#8e5ea2", "#3cba9f", "#FFC300", "#c45850"]
          }
        ]
      }
    }
  )

  new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: chartData.productWiseSale.map(row => row._id),
      datasets: [
        {
          label: 'TOTAL PRODUCT WISE SALE',
          data: chartData.productWiseSale.map(row => row.totalAmount),
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",
          "#8e5ea2", "#3cba9f", "#FFC300", "#c45850"
            , "#8e5ea2", "#3cba9f", "#FFC300", "#c45850",
          "#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",          
        ],
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'TOTAL PRODUCT WISE SALE in Doughnut Chart'
      }
    }
  })
  console.log('chart worked!')
}
