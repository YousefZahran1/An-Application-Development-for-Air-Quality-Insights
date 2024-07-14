// Map Data
const mapData = {
    2014: {
        'Bangkok': 70,
        'Hanoi': 60,
        'Jakarta': 80,
        'Kuala Lumpur': 55,
        'Manila': 85,
        'Naypyidaw': 45,
        'Phnom Penh': 60,
        'Singapore': 30,
        'Vientiane': 50,
        'Bandar Seri Begawan': 40,
        'Dili': 65
    },
    2015: {
        'Bangkok': 75,
        'Hanoi': 65,
        'Jakarta': 85,
        'Kuala Lumpur': 60,
        'Manila': 90,
        'Naypyidaw': 50,
        'Phnom Penh': 65,
        'Singapore': 35,
        'Vientiane': 55,
        'Bandar Seri Begawan': 45,
        'Dili': 70
    },
    2016: {
        'Bangkok': 78,
        'Hanoi': 68,
        'Jakarta': 88,
        'Kuala Lumpur': 63,
        'Manila': 93,
        'Naypyidaw': 53,
        'Phnom Penh': 68,
        'Singapore': 38,
        'Vientiane': 58,
        'Bandar Seri Begawan': 48,
        'Dili': 73
    },
    2017: {
        'Bangkok': 80,
        'Hanoi': 70,
        'Jakarta': 90,
        'Kuala Lumpur': 65,
        'Manila': 95,
        'Naypyidaw': 55,
        'Phnom Penh': 70,
        'Singapore': 40,
        'Vientiane': 60,
        'Bandar Seri Begawan': 50,
        'Dili': 75
    },
    2018: {
        'Bangkok': 82,
        'Hanoi': 72,
        'Jakarta': 92,
        'Kuala Lumpur': 67,
        'Manila': 97,
        'Naypyidaw': 57,
        'Phnom Penh': 72,
        'Singapore': 42,
        'Vientiane': 62,
        'Bandar Seri Begawan': 52,
        'Dili': 77
    },
    2019: {
        'Bangkok': 84,
        'Hanoi': 74,
        'Jakarta': 94,
        'Kuala Lumpur': 69,
        'Manila': 99,
        'Naypyidaw': 59,
        'Phnom Penh': 74,
        'Singapore': 44,
        'Vientiane': 64,
        'Bandar Seri Begawan': 54,
        'Dili': 79
    },
    2020: {
        'Bangkok': 86,
        'Hanoi': 76,
        'Jakarta': 96,
        'Kuala Lumpur': 71,
        'Manila': 101,
        'Naypyidaw': 61,
        'Phnom Penh': 76,
        'Singapore': 46,
        'Vientiane': 66,
        'Bandar Seri Begawan': 56,
        'Dili': 81
    },
    2021: {
        'Bangkok': 88,
        'Hanoi': 78,
        'Jakarta': 98,
        'Kuala Lumpur': 73,
        'Manila': 103,
        'Naypyidaw': 63,
        'Phnom Penh': 78,
        'Singapore': 48,
        'Vientiane': 68,
        'Bandar Seri Begawan': 58,
        'Dili': 83
    },
    2022: {
        'Bangkok': 90,
        'Hanoi': 80,
        'Jakarta': 100,
        'Kuala Lumpur': 75,
        'Manila': 105,
        'Naypyidaw': 65,
        'Phnom Penh': 80,
        'Singapore': 50,
        'Vientiane': 70,
        'Bandar Seri Begawan': 60,
        'Dili': 85
    },
    2023: {
        'Bangkok': 85,
        'Hanoi': 75,
        'Jakarta': 95,
        'Kuala Lumpur': 65,
        'Manila': 105,
        'Naypyidaw': 55,
        'Phnom Penh': 70,
        'Singapore': 40,
        'Vientiane': 60,
        'Bandar Seri Begawan': 50,
        'Dili': 80
    },
    2024: {
        'Bangkok': 80,
        'Hanoi': 70,
        'Jakarta': 90,
        'Kuala Lumpur': 60,
        'Manila': 100,
        'Naypyidaw': 50,
        'Phnom Penh': 65,
        'Singapore': 35,
        'Vientiane': 55,
        'Bandar Seri Begawan': 45,
        'Dili': 75
    }
};

// Accessing chart data
const chartData = mapData;
console.log(chartData);

// Map Functionality
const yearSelectMap = document.getElementById('year-select');
const mapContainer = document.getElementById('map');

// Populate year select options for the map
for (let year in mapData) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearSelectMap.appendChild(option);
}

// Render initial map
let map; // Store the Leaflet map instance globally

renderMap(Object.keys(mapData)[0]);

function applyMap() {
    const selectedYear = yearSelectMap.value;
    try {
        if (!mapData[selectedYear]) throw new Error("Data for the selected year is not available.");
        renderMap(selectedYear);
        updateLegend(selectedYear);
    } catch (error) {
        console.error('Error applying map:', error);
        alert(`An error occurred while updating the map: ${error.message}. Please try again.`);
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

function getColor(aqi) {
    if (aqi >= 0 && aqi <= 50) {
        return 'rgba(0, 128, 0, 0.8)'; // Green with opacity 0.8
    } else if (aqi > 50 && aqi <= 100) {
        return 'rgba(255, 255, 0, 0.8)'; // Yellow with opacity 0.8
    } else if (aqi > 100 && aqi <= 150) {
        return 'rgba(255, 165, 0, 0.8)'; // Orange with opacity 0.8
    } else if (aqi > 150 && aqi <= 200) {
        return 'rgba(255, 0, 0, 0.8)'; // Red with opacity 0.8
    } else {
        return 'rgba(0, 0, 0, 0.8)'; // Default color if AQI value is out of range
    }
}

// Function to render the map for a specific year
function renderMap(year) {
    // Remove existing map if it exists
    if (map) {
        map.remove();
    }

    // Create a new Leaflet map instance centered on Southeast Asia
    map = L.map('map').setView([4.2105, 101.9758], 6);

    // Add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // Add city markers and circles indicating AQI values
    for (let city in mapData[year]) {
        const aqi = mapData[year][city];
        const marker = L.marker(getCoordinates(city)).addTo(map);
        marker.bindPopup(`${city}: ${aqi}`);

        const circle = L.circle(getCoordinates(city), {
            color: getColor(aqi),
            fillColor: getColor(aqi),
            fillOpacity: 0.5,
            radius: 50000 // Adjust the radius as per your preference
        }).addTo(map);
    }
}

// Helper function to get coordinates of a city
function getCoordinates(city) {
    const coordinates = {
        'Bangkok': [13.7563, 100.5018],
        'Hanoi': [21.0285, 105.8542],
        'Jakarta': [-6.2088, 106.8456],
        'Kuala Lumpur': [3.1390, 101.6869],
        'Manila': [14.5995, 120.9842],
        'Naypyidaw': [19.7633, 96.0785],
        'Phnom Penh': [11.5564, 104.9282],
        'Singapore': [1.3521, 103.8198],
        'Vientiane': [17.9757, 102.6331],
        'Bandar Seri Begawan': [4.9031, 114.9398],
        'Dili': [-8.5569, 125.5603]
    };

    return coordinates[city];
}

// Chart Functionality
const yearSelectChart = document.getElementById('year-select-chart');
const chartContainer = document.getElementById('chart');

// Populate year select options for the chart
for (let year in chartData) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearSelectChart.appendChild(option);
}

// Render initial chart
renderChart(Object.keys(chartData)[0], 'bar');

function applyChart() {
    const selectedYear = yearSelectChart.value;
    const chartType = document.querySelector('input[name="chart-type"]:checked').value;
    try {
        if (!chartData[selectedYear]) throw new Error("Data for the selected year is not available.");
        renderChart(selectedYear, chartType);
    } catch (error) {
        console.error('Error applying chart:', error);
        alert(`An error occurred while updating the chart: ${error.message}. Please try again.`);
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}
function renderChart(year, type) {
    // Clear existing chart
    chartContainer.innerHTML = '';

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'aqi-chart';
    chartContainer.appendChild(chartCanvas);

    const ctx = document.getElementById('aqi-chart').getContext('2d');

    const labels = Object.keys(chartData[year]);
    const data = Object.values(chartData[year]);

    const backgroundColors = data.map(aqi => getColor(aqi)); // Get colors based on AQI values
    const borderColors = backgroundColors.map(color => `${color}ff`); // Add alpha value to border color

    new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: `Air Quality Index (${year})`,
                data: data,
                backgroundColor: type === 'bar' ? backgroundColors : 'rgba(0, 123, 255, 0.5)',
                borderColor: type === 'bar' ? borderColors : 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                fill: type === 'line',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function toggleChartView() {
    const selectedYear = yearSelectChart.value;
    const currentType = document.querySelector('input[name="chart-type"]:checked').value;
    const newType = currentType === 'bar' ? 'line' : 'bar';

    // Update radio button value
    document.querySelector(`input[value="${newType}"]`).checked = true;

    renderChart(selectedYear, newType);
}

// Additional Functions
function updateLegend(year) {
    const legend = document.getElementById('legend');
    legend.innerHTML = `<h3>Legend (${year})</h3>`;
    for (let city in mapData[year]) {
        const aqi = mapData[year][city];
        const color = getColor(aqi);
        const legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${color}"></span>
            <span class="legend-label">${city} (${aqi})</span>
        `;
        legend.appendChild(legendItem);
    }
}

// Initial legend update
updateLegend(Object.keys(mapData)[0]);

// Add event listener to chart toggle buttons
document.getElementById('apply-chart').addEventListener('click', applyChart);
document.getElementById('toggle-chart').addEventListener('click', toggleChartView);

// Example test using Jest
test('getColor returns correct color for AQI value', () => {
    expect(getColor(45)).toBe('rgba(0, 128, 0, 0.8)');
    expect(getColor(75)).toBe('rgba(255, 255, 0, 0.8)');
    expect(getColor(125)).toBe('rgba(255, 165, 0, 0.8)');
    expect(getColor(175)).toBe('rgba(255, 0, 0, 0.8)');
});
