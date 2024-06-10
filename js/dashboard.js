document.addEventListener("DOMContentLoaded", function () {
    showSelectedChart();

    fetch('analisis.json')
        .then(response => response.json())
        .then(data => {
            const categoryData = data.filter(item => item.category);
            const stateData = data.filter(item => item['state-order_date_tahun_-sales']);
            const tableData = data.filter(item => item.state && item.sales && item.profit && item.transaction);
            displayDataInTable(tableData);
            activatePagination(tableData);
            const subCategoryData = data.filter(item => item.sub_category && item.sales && item.profit && item.transaction);
            displaySubCategoryDataInTable(subCategoryData);
            activateSubCategoryPagination(subCategoryData);
            const stateAOVData = data.filter(item => item.state && item.aov);
            displayStateAOVData(stateAOVData);
            activateAOVPagination(stateAOVData);

    
            const categoryCtx = document.getElementById('categoryChart').getContext('2d');
            let categoryChart = createCategoryChart(categoryCtx, categoryData);

            document.getElementById('categorySort').addEventListener('change', function() {
                const order = this.value;
                categoryChart.destroy(); // Destroy the current chart before creating a new one
                categoryChart = createCategoryChart(categoryCtx, categoryData, order);
            });

            function createCategoryChart(ctx, data, order = 'none') {
                let sortedData = [...data];

                if (order === 'asc') {
                    sortedData.sort((a, b) => a.sales - b.sales);
                } else if (order === 'desc') {
                    sortedData.sort((a, b) => b.sales - a.sales);
                }

                const labels = sortedData.map(item => item.category);
                const values = sortedData.map(item => item.sales);

                return new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Sales by Category',
                            data: values,
                            backgroundColor: [
                                '#FF9A00',
                                '#FFBF00',
                                '#FFDA78'
                            ],
                            borderColor: [
                                '#FF9A00',
                                '#FFBF00',
                                '#FFDA78'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                            }
                        }
                    }
                });
            }

            // Initialize the "Sales by State" chart
            const stateCtx = document.getElementById('stateChart').getContext('2d');
            let stateChart = createStateChart(stateCtx, stateData);

            // Add event listener for sorting the "Sales by State" chart
            document.getElementById('salesstateSort').addEventListener('change', function() {
                const order = this.value;
                stateChart.destroy(); // Destroy the current chart before creating a new one
                stateChart = createStateChart(stateCtx, stateData, order);
            });

            function createStateChart(ctx, data, order = 'none') {
                const groupedStateSales = {};
                data.forEach(item => {
                    const parts = item['state-order_date_tahun_-sales'].split('-');
                    const state = parts[0];
                    const year = parts[1];
                    const sales = parseFloat(parts[2]);

                    if (!groupedStateSales[state]) {
                        groupedStateSales[state] = { '2016': 0, '2017': 0 };
                    }
                    groupedStateSales[state][year] += sales;
                });

                let states = Object.keys(groupedStateSales);
                let stateValues2016 = states.map(state => groupedStateSales[state]['2016']);
                let stateValues2017 = states.map(state => groupedStateSales[state]['2017']);

                if (order === 'asc') {
                    states = states.sort((a, b) => (groupedStateSales[a]['2016'] + groupedStateSales[a]['2017']) - (groupedStateSales[b]['2016'] + groupedStateSales[b]['2017']));
                } else if (order === 'desc') {
                    states = states.sort((a, b) => (groupedStateSales[b]['2016'] + groupedStateSales[b]['2017']) - (groupedStateSales[a]['2016'] + groupedStateSales[a]['2017']));
                }

                stateValues2016 = states.map(state => groupedStateSales[state]['2016']);
                stateValues2017 = states.map(state => groupedStateSales[state]['2017']);

                return new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: states,
                        datasets: [{
                            label: '2016',
                            data: stateValues2016,
                            backgroundColor: '#FFDB5C',
                            borderColor: '#FFDB5C',
                            borderWidth: 1
                        },
                        {
                            label: '2017',
                            data: stateValues2017,
                            backgroundColor: '#FF9A00',
                            borderColor: '#FF9A00',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                            }
                        }
                    }
                });
            }

            

            
            const discountData = data.filter(item => item.discount);
            const avgDiscountData = {};
            discountData.forEach(item => {
                const key = item.state;
                if (!avgDiscountData[key]) {
                    avgDiscountData[key] = { '2016': [], '2017': [] };
                }
                avgDiscountData[key][item.year].push(item.discount);
            });

            let avgDiscountLabels = Object.keys(avgDiscountData);
            let avgDiscountValues2016 = avgDiscountLabels.map(key => {
                const discounts = avgDiscountData[key]['2016'];
                return discounts.reduce((acc, curr) => acc + curr, 0) / discounts.length;
            });

            let avgDiscountValues2017 = avgDiscountLabels.map(key => {
                const discounts = avgDiscountData[key]['2017'];
                return discounts.reduce((acc, curr) => acc + curr, 0) / discounts.length;
            });

            const avgDiscountCtx = document.getElementById('avgDiscountChart').getContext('2d');
            let avgDiscountChart = new Chart(avgDiscountCtx, {
                type: 'bar',
                data: {
                    labels: avgDiscountLabels,
                    datasets: [{
                            label: 'Average Discount 2016',
                            data: avgDiscountValues2016,
                            backgroundColor: '#FFDB5C',
                            borderColor: '#FFDB5C',
                            borderWidth: 1
                        },
                        {
                            label: 'Average Discount 2017',
                            data: avgDiscountValues2017,
                            backgroundColor: '#FF9A00',
                            borderColor: '#FF9A00',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                        }
                    }
                }
            });

            document.getElementById('avgDiscountSort').addEventListener('change', () => {
                const order = document.getElementById('avgDiscountSort').value;
                sortAvgDiscountChart(avgDiscountChart, avgDiscountData, order);
            });

            function sortAvgDiscountChart(chart, data, order) {
                let sortedLabels;
                let sortedValues2016;
                let sortedValues2017;

                if (order === 'asc') {
                    sortedLabels = avgDiscountLabels.slice().sort((a, b) => {
                        return (
                            (avgDiscountData[a]['2016'].reduce((acc, curr) => acc + curr, 0) / avgDiscountData[a]['2016'].length) -
                            (avgDiscountData[b]['2016'].reduce((acc, curr) => acc + curr, 0) / avgDiscountData[b]['2016'].length)
                        );
                    });
                } else if (order === 'desc') {
                    sortedLabels = avgDiscountLabels.slice().sort((a, b) => {
                        return (
                            (avgDiscountData[b]['2016'].reduce((acc, curr) => acc + curr, 0) / avgDiscountData[b]['2016'].length) -
                            (avgDiscountData[a]['2016'].reduce((acc, curr) => acc + curr, 0) / avgDiscountData[a]['2016'].length)
                        );
                    });
                }

                sortedValues2016 = sortedLabels.map(key => {
                    const discounts = avgDiscountData[key]['2016'];
                    return discounts.reduce((acc, curr) => acc + curr, 0) / discounts.length;
                });

                sortedValues2017 = sortedLabels.map(key => {
                    const discounts = avgDiscountData[key]['2017'];
                    return discounts.reduce((acc, curr) => acc + curr, 0) / discounts.length;
                });

                chart.data.labels = sortedLabels;
                chart.data.datasets[0].data = sortedValues2016;
                chart.data.datasets[1].data = sortedValues2017;
                chart.update();
            }
            

            const quarterlyData = data.filter(item => item.order_date_tahun_kuartal_);
            const quarterlyLabels = quarterlyData.map(item => item.order_date_tahun_kuartal_);
            const quarterlySalesValues = quarterlyData.map(item => item.sales);
            const quarterlyProfitValues = quarterlyData.map(item => item.profit);

            const quarterlySalesAndProfitCtx = document.getElementById('quarterlySalesAndProfitChart').getContext('2d');
            const quarterlySalesAndProfitChart = new Chart(quarterlySalesAndProfitCtx, {
                type: 'bar',
                data: {
                    labels: quarterlyLabels,
                    datasets: [{
                        type: 'bar',
                        label: 'Quarterly Sales',
                        data: quarterlySalesValues,
                        backgroundColor: 'rgba(255, 219, 92, 0.5)',
                        borderColor: 'rgba(255, 219, 92, 0.1)',
                        borderWidth: 1
                    }, {
                        type: 'line',
                        label: 'Quarterly Profit',
                        data: quarterlyProfitValues,
                        backgroundColor: '#FF9A00',
                        borderColor: '#FF9A00',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('quarterlySort').addEventListener('change', () => {
                const order = document.getElementById('quarterlySort').value;
                sortQuarterlyChart(quarterlySalesAndProfitChart, quarterlyData, order);
            });
            
            function sortQuarterlyChart(chart, data, order) {
                let sortedLabels;
                let sortedSalesValues;
                let sortedProfitValues;
            
                if (order === 'asc') {
                    sortedLabels = quarterlyLabels.slice().sort();
                } else if (order === 'desc') {
                    sortedLabels = quarterlyLabels.slice().sort().reverse();
                }
            
                sortedSalesValues = sortedLabels.map(label => {
                    const index = quarterlyLabels.indexOf(label);
                    return quarterlySalesValues[index];
                });
            
                sortedProfitValues = sortedLabels.map(label => {
                    const index = quarterlyLabels.indexOf(label);
                    return quarterlyProfitValues[index];
                });
            
                chart.data.labels = sortedLabels;
                chart.data.datasets[0].data = sortedSalesValues;
                chart.data.datasets[1].data = sortedProfitValues;
                chart.update();
            }
            

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
            const absSubCategoryChart = new Chart(absCtx, {
                type: 'bar',
                data: {
                    labels: absLabels,
                    datasets: [{
                        label: '2016',
                        data: absValues2016,
                        backgroundColor: '#FFDB5C',
                        borderColor: '#FFDB5C',
                        borderWidth: 1
                    },
                    {
                        label: '2017',
                        data: absValues2017,
                        backgroundColor: '#FF9A00',
                        borderColor: '#FF9A00',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                        }
                    }
                }
            });

            document.getElementById('absSort').addEventListener('change', () => {
                const order = document.getElementById('absSort').value;
                sortAbsChart(absSubCategoryChart, groupedAbsData, order); // Menggunakan groupedAbsData
            });
            
            function sortAbsChart(chart, data, order) {
                let sortedLabels;
                let sortedValues2016 = [];
                let sortedValues2017 = [];
            
                if (order === 'asc') {
                    sortedLabels = Object.keys(data).sort();
                } else if (order === 'desc') {
                    sortedLabels = Object.keys(data).sort().reverse();
                }
            
                sortedLabels.forEach(label => {
                    const absValues2016 = data[label]['2016'];
                    const absValues2017 = data[label]['2017'];
                    const avg2016 = absValues2016.length > 0 ? absValues2016.reduce((acc, curr) => acc + curr, 0) / absValues2016.length : 0;
                    const avg2017 = absValues2017.length > 0 ? absValues2017.reduce((acc, curr) => acc + curr, 0) / absValues2017.length : 0;
                    sortedValues2016.push(avg2016);
                    sortedValues2017.push(avg2017);
                });
            
                chart.data.labels = sortedLabels;
                chart.data.datasets[0].data = sortedValues2016;
                chart.data.datasets[1].data = sortedValues2017;
                chart.update();
            }
            
            
                
        
            const customerData = data.filter(item => item.state && item.customer_id);

            const customerByStateCounts = {};
            
            customerData.forEach(item => {
                const state = item.state;
                const customerId = item.customer_id;
                
                if (state) {
                    customerByStateCounts[state] = customerId;
                }
            });
            
            const customerByStateLabels = Object.keys(customerByStateCounts);
            const customerCountsValues = customerByStateLabels.map(state => customerByStateCounts[state]);
            
            const customerByStateCtx = document.getElementById('customerByStateChart').getContext('2d');
            const customerByStateChart = new Chart(customerByStateCtx, {
                type: 'bar',
                data: {
                    labels: customerByStateLabels,
                    datasets: [{
                        label: 'Top Customer Count by State',
                        data: customerCountsValues,
                        backgroundColor: '#FF9A00',
                        borderColor: '#FF9A00',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                        }
                    }
                }
            });
            
            document.getElementById('customerSort').addEventListener('change', function() {
                const order = this.value;
                sortCustomerChart(customerByStateChart, order);
            });
            
            function sortCustomerChart(chart, order) {
                let sortedLabels;
                let sortedValues;
            
                if (order === 'asc') {
                    sortedLabels = customerByStateLabels.slice().sort((a, b) => customerByStateCounts[a] - customerByStateCounts[b]);
                } else if (order === 'desc') {
                    sortedLabels = customerByStateLabels.slice().sort((a, b) => customerByStateCounts[b] - customerByStateCounts[a]);
                }
            
                sortedValues = sortedLabels.map(state => customerByStateCounts[state]);
            
                chart.data.labels = sortedLabels;
                chart.data.datasets[0].data = sortedValues;
                chart.update();
            }
            
            
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
    
        // Jumlah data yang akan ditampilkan per halaman
        const itemsPerPage = 10;
        let currentPage = 1;
    
        function displayDataInTable(data) {
            const tableBody = document.getElementById('salesProfitTransactionTableBody');
            tableBody.innerHTML = "";
    
            // Hitung indeks awal dan akhir untuk data yang akan ditampilkan
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(currentPage * itemsPerPage, data.length);
    
            // Ambil subset data sesuai dengan halaman saat ini
            const dataToShow = data.slice(startIndex, endIndex);
    
            dataToShow.forEach(item => {
                const row = document.createElement('tr');
                const state = item.state ? item.state : '-';
                const sales = item.sales ? item.sales.toFixed(2) : '-';
                const profit = item.profit ? item.profit.toFixed(2) : '-';
                const transaction = item.transaction ? item.transaction : '-';
                row.innerHTML = `
                <td>${state}</td>
                <td>${sales}</td>
                <td>${profit}</td>
                <td>${transaction}</td>
            `;
                tableBody.appendChild(row);
            });
    
            const showingStateInfo = document.getElementById('showingStateInfo');
            showingStateInfo.innerText = `Showing ${startIndex + 1} to ${endIndex} of ${data.length} entries`;
            
            document.getElementById('current-page').innerText = currentPage;
        }
    
        function activatePagination(data) {
            // Tambahkan event listener untuk tombol navigasi halaman sebelum dan sesudah
            document.getElementById('prev-page').addEventListener('click', function () {
                if (currentPage > 1) {
                    currentPage--;
                    displayDataInTable(data);
                }
            });
    
            document.getElementById('next-page').addEventListener('click', function () {
                const maxPage = Math.ceil(data.length / itemsPerPage);
                if (currentPage < maxPage) {
                    currentPage++;
                    displayDataInTable(data);
                }
            });
        }
    
        let currentSubCategoryPage = 1;
    
        function displaySubCategoryDataInTable(data) {
            const tableBody = document.getElementById('subCategoryTableBody');
            tableBody.innerHTML = "";
    
            const startIndex = (currentSubCategoryPage - 1) * itemsPerPage;
            const endIndex = Math.min(currentSubCategoryPage * itemsPerPage, data.length);
            const dataToShow = data.slice(startIndex, endIndex);
    
            dataToShow.forEach(item => {
                const row = document.createElement('tr');
                const subCategory = item.sub_category ? item.sub_category : '-';
                const sales = item.sales ? item.sales.toFixed(2) : '-';
                const profit = item.profit ? item.profit.toFixed(2) : '-';
                const transaction = item.transaction ? item.transaction : '-';
                row.innerHTML = `
                <td>${subCategory}</td>
                <td>${sales}</td>
                <td>${profit}</td>
                <td>${transaction}</td>
            `;
                tableBody.appendChild(row);
            });

            const showingCategoryInfo = document.getElementById('showingCategoryInfo');
            showingCategoryInfo.innerText = `Showing ${startIndex + 1} to ${endIndex} of ${data.length} entries`;
    
            document.getElementById('subCategory-current-page').innerText = currentSubCategoryPage;
        }
    
        function activateSubCategoryPagination(data) {
            document.getElementById('prev-subCategoryPage').addEventListener('click', function () {
                if (currentSubCategoryPage > 1) {
                    currentSubCategoryPage--;
                    displaySubCategoryDataInTable(data);
                }
            });
    
            document.getElementById('next-subCategoryPage').addEventListener('click', function () {
                const maxPage = Math.ceil(data.length / itemsPerPage);
                if (currentSubCategoryPage < maxPage) {
                    currentSubCategoryPage++;
                    displaySubCategoryDataInTable(data);
                }
            });
    
        }
    
        const AOVPerPage = 10;
        let AOVPage = 1;
        
        function displayStateAOVData(data) {
            const tableBody = document.getElementById('stateAOVTableBody');
            tableBody.innerHTML = "";
        
            const startIndex = (AOVPage - 1) * AOVPerPage;
            const endIndex = Math.min(AOVPage * AOVPerPage, data.length);
        
            const dataToShow = data.slice(startIndex, endIndex);
        
            dataToShow.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.state}</td>
                    <td>${item.aov.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        
            const showingAovInfo = document.getElementById('showingDataInfo');
            showingAovInfo.innerText = `Showing ${startIndex + 1} to ${endIndex} of ${data.length} entries`;
        }
        
        function activateAOVPagination(data) {
            const paginationContainer = document.getElementById('aov-pagination-container');
        
            paginationContainer.addEventListener('click', function (event) {
                if (event.target.tagName === 'BUTTON') {
                    const buttonText = event.target.innerText;
                    if (buttonText === 'Previous' && AOVPage > 1) {
                        AOVPage--;
                    } else if (buttonText === 'Next') {
                        const maxPage = Math.ceil(data.length / AOVPerPage);
                        if (AOVPage < maxPage) {
                            AOVPage++;
                        }
                    } else {
                        AOVPage = parseInt(buttonText); // Go to the page clicked
                    }
        
                    displayStateAOVData(data);
                    updatePagination();
                }
            });
        
            function updatePagination() {
                const paginationHTML = [];
                const maxPage = Math.ceil(data.length / AOVPerPage);
            
                if (AOVPage > 1) {
                    paginationHTML.push('<button id="prev-aovPage">Previous</button>');
                } else {
                    paginationHTML.push('<button id="prev-aovPage" disabled>Previous</button>');
                }
            
                paginationHTML.push(`<span class="current">${AOVPage}</span>`); // Hanya menampilkan nomor halaman saat ini
            
                if (AOVPage < maxPage) {
                    paginationHTML.push('<button id="next-aovPage">Next</button>');
                } else {
                    paginationHTML.push('<button id="next-aovPage" disabled>Next</button>');
                }
            
                paginationContainer.innerHTML = paginationHTML.join(' ');
            }
            
            updatePagination();
        }
        
        
        
    function showSelectedChart() {
        const selectedChart = document.getElementById('chartSelector').value;
        const chartBoxes = document.querySelectorAll('.chartBox');
        const tables = document.querySelectorAll('.table-container');

        chartBoxes.forEach(box => {
            box.style.display = 'none';
        });
        tables.forEach(table => {
            table.style.display = 'none';
        });

        if (selectedChart === 'all') {
            chartBoxes.forEach(box => {
                box.style.display = 'block';
            });
            tables.forEach(table => {
                table.style.display = 'block';
            });
        } else {
            const chartBox = document.getElementById(`${selectedChart}Box`);
            if (chartBox) {
                chartBox.style.display = 'block';
            }
            const table = document.getElementById(`${selectedChart}-container`);
            if (table) {
                table.style.display = 'block';
            }
        }
    }

    document.getElementById('chartSelector').addEventListener('change', showSelectedChart);

    showSelectedChart();
        
    });
