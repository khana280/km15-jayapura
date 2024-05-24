document.addEventListener("DOMContentLoaded", function() {
    showSelectedChart();

    fetch('analisis.json')
        .then(response => response.json())
        .then(data => {
            const categoryData = data.filter(item => item.category);
            const stateData = data.filter(item => item['state-order_date_tahun_-sales']);

            const categoryLabels = categoryData.map(item => item.category);
            const categoryValues = categoryData.map(item => item.sales);

            const categoryCtx = document.getElementById('categoryChart').getContext('2d');
            new Chart(categoryCtx, {
                type: 'pie',
                data: {
                    labels: categoryLabels,
                    datasets: [{
                        label: 'Sales by Category',
                        data: categoryValues,
                        backgroundColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.4)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        // dataLabels: {
                        //     display: true,
                        //     color: 'white'
                        // },
                        title: {
                            display: true,
                            text: 'Sales by Category'
                        }
                    }
                }
            });

            const groupedStateSales = {};
            stateData.forEach(item => {
                const parts = item['state-order_date_tahun_-sales'].split('-');
                const state = parts[0];
                const year = parts[1];
                const sales = parseFloat(parts[2]);

                if (!groupedStateSales[state]) {
                    groupedStateSales[state] = { '2016': 0, '2017': 0 };
                }
                groupedStateSales[state][year] += sales;
            });

            const states = Object.keys(groupedStateSales);
            const stateLabels = states;
            const stateValues2016 = states.map(state => groupedStateSales[state]['2016']);
            const stateValues2017 = states.map(state => groupedStateSales[state]['2017']);

            const stateCtx = document.getElementById('stateChart').getContext('2d');
            new Chart(stateCtx, {
                type: 'bar',
                data: {
                    labels: stateLabels,
                    datasets: [{
                        label: '2016',
                        data: stateValues2016,
                        backgroundColor: 'rgba(54, 162, 235, 1)',
                     
                        borderWidth: 1
                    },
                    {
                        label: '2017',
                        data: stateValues2017,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Sales by State'
                        },
                        // buang garis grid
                        // berikan label pada sumbu x dan y
                        
                    },
                    scales: {
                        y: {
                            grid: {
                                display: false
                            },
                            beginAtZero: true
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            title: {
                                display: true
                            }
                        }
                    },
                }
            });

            const discountData = data.filter(item => item.discount);
            const avgDiscountData = {};
            discountData.forEach(item => {
                const key = item.state;
                if (!avgDiscountData[key]) {
                    avgDiscountData[key] = { '2016': [], '2017': [] };
                }
                avgDiscountData[key][item.year].push(item.discount);
            });

            const avgDiscountLabels = Object.keys(avgDiscountData);
            const avgDiscountValues2016 = avgDiscountLabels.map(key => {
                const discounts = avgDiscountData[key]['2016'];
                return discounts.reduce((acc, curr) => acc + curr, 0) / discounts.length;
            });

            const avgDiscountValues2017 = avgDiscountLabels.map(key => {
                const discounts = avgDiscountData[key]['2017'];
                return discounts.reduce((acc, curr) => acc + curr, 0) / discounts.length;
            });

            const avgDiscountCtx = document.getElementById('avgDiscountChart').getContext('2d');
            new Chart(avgDiscountCtx, {
                type: 'bar',
                data: {
                    labels: avgDiscountLabels,
                    datasets: [{
                        label: 'Average Discount 2016',
                        data: avgDiscountValues2016,
                        backgroundColor: 'rgba(54, 162, 235, 1)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Average Discount 2017',
                        data: avgDiscountValues2017,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 0.5)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Average Discount by State'
                        }
                    }
                }
            });

            const quarterlyData = data.filter(item => item.order_date_tahun_kuartal_);
            const quarterlyLabels = quarterlyData.map(item => item.order_date_tahun_kuartal_);
            const quarterlySalesValues = quarterlyData.map(item => item.sales);
            const quarterlyProfitValues = quarterlyData.map(item => item.profit);

            const quarterlySalesAndProfitCtx = document.getElementById('quarterlySalesAndProfitChart').getContext('2d');
            new Chart(quarterlySalesAndProfitCtx, {
                type: 'bar',
                data: {
                    labels: quarterlyLabels,
                    datasets: [{
                        type: 'bar',
                        label: 'Quarterly Sales',
                        data: quarterlySalesValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }, {
                        type: 'line',
                        label: 'Quarterly Profit',
                        data: quarterlyProfitValues,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Quarterly Sales and Profit'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const absData = data.filter(item => item.abs !== undefined);
            const groupedAbsData = {};
            absData.forEach(item => {
                const subCategory = item.sub_category;
                const year = item.year;
                            const absValue = parseFloat(item.abs);

            if (!groupedAbsData[subCategory]) {
                groupedAbsData[subCategory] = { '2016': [], '2017': [] };
            }
            groupedAbsData[subCategory][year].push(absValue);
        });

        const absLabels = Object.keys(groupedAbsData);
        const absValues2016 = absLabels.map(label => {
            const absValues = groupedAbsData[label]['2016'];
            return absValues.length > 0 ? absValues.reduce((acc, curr) => acc + curr, 0) / absValues.length : 0;
        });
        const absValues2017 = absLabels.map(label => {
            const absValues = groupedAbsData[label]['2017'];
            return absValues.length > 0 ? absValues.reduce((acc, curr) => acc + curr, 0) / absValues.length : 0;
        });

        const absCtx = document.getElementById('absSubCategoryChart').getContext('2d');
        new Chart(absCtx, {
            type: 'bar',
            data: {
                labels: absLabels,
                datasets: [{
                    label: '2016',
                    data: absValues2016,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: '2017',
                    data: absValues2017,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Abs by Sub-Category'
                    }
                }
            }
        });

        
            // Mengambil label negara bagian dan jumlah pelanggan dari data
            const customerByStateLabels = data.map(item => item.state);
            const customerCountsValues = data.map(item => parseInt(item.customer_id));
            
            // Membuat grafik menggunakan Chart.js
            const customerByStateCtx = document.getElementById('customerByStateChart').getContext('2d');
            new Chart(customerByStateCtx, {
                type: 'bar',
                data: {
                    labels: customerByStateLabels,
                    datasets: [{
                        label: 'Customer Count by State',
                        data: customerCountsValues,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Customer Count by State'
                        }
                    }
                }
            });
        
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});

function showSelectedChart() {
    const selectedChart = document.getElementById('chartSelector').value;

    if (selectedChart === 'all') {
        document.querySelectorAll('.chartBox').forEach(box => {
            box.style.display = 'block';
        });
    } else {
        document.querySelectorAll('.chartBox').forEach(box => {
            box.style.display = 'none';
        });

        document.getElementById(selectedChart + 'ChartBox').style.display = 'block';
    }
}

