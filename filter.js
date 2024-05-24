document.addEventListener('DOMContentLoaded', function() {
    function filterByYear() {
        const selectedYear = document.getElementById('yearSelector').value;
        const selectedChart = document.getElementById('chartSelector').value;
    
        fetch('analisis.json')
        .then(response => response.json())
        .then(data => {
            // Filter data berdasarkan tahun
            const filteredData = data.filter(item => {
                if (selectedYear === 'all') {
                    return true; // Tampilkan semua data jika dipilih 'All Years'
                } else {
                    // Filter berdasarkan jenis data
                    if (item['state-order_date_tahun_-sales']) {
                        const parts = item['state-order_date_tahun_-sales'].split('-');
                        const itemYear = parts[1];
                        return itemYear === selectedYear;
                    } else if (item['order_date_tahun_kuartal_']) {
                        const parts = item['order_date_tahun_kuartal_'].split(', ');
                        const itemYear = parts[1];
                        return itemYear === selectedYear;
                    } else if (item.year) {
                        return item.year === selectedYear;
                    } else {
                        return false;
                    }
                }
            });
    
            // Memanggil fungsi untuk menampilkan chart yang dipilih
            showChart(selectedChart, filteredData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    
    

    function updateChart(chart, labels, values) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();
    }

    fetch('analisis.json')
    .then(response => response.json())
    .then(data => {
        const rawData = data;

        const categoryData = rawData.filter(item => item.category);
        const categoryLabels = categoryData.map(item => item.category);
        const categoryValues = categoryData.map(item => item.sales);
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        const categoryChart = new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: 'Sales by Category',
                    data: categoryValues,
                    backgroundColor: [
                        'rgba(255, 26, 104, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 26, 104, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
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
                        text: 'Sales by Category'
                    }
                }
            }
        });

        function filterAndUpdateChart(year) {
            const filteredData = filterDataByYear(rawData, year);
            const filteredCategoryData = filteredData.filter(item => item.category);
            const filteredCategoryLabels = filteredCategoryData.map(item => item.category);
            const filteredCategoryValues = filteredCategoryData.map(item => item.sales);
            updateChart(categoryChart, filteredCategoryLabels, filteredCategoryValues);
        }

        filterAndUpdateChart('all');

        document.getElementById('yearSelector').addEventListener('change', function() {
            const selectedYear = this.value;
            filterAndUpdateChart(selectedYear);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});
