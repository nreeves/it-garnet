async function fetchWaterLevel(startDate, endDate, siteCode, siteName) {
    try {
        const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteCode}&siteStatus=all&startDT=${startDate}&endDT=${endDate}`;
        
        const response = await fetch(url);
        const responseData = await response.json();
        
        const waterLevels = [];

        if (responseData.value && responseData.value.timeSeries) {
            responseData.value.timeSeries.forEach(series => {
                const gageHeightVariable = series.variable.variableCode.find(variable => variable.value === "00065");
                
                if (gageHeightVariable) {
                    series.values[0].value.forEach(value => {
                        const dateTime = new Date(value.dateTime);
                        waterLevels.push({ time: dateTime, waterLevel: parseFloat(value.value) });
                    });
                }
            });
        }
        return waterLevels;
    } catch (error) {
        return [];
    }
}

async function createCharts(startDate, endDate, siteData) {
    const chartsGrid = document.getElementById('chartsGrid');

    for (const site of siteData) {
        const waterLevels = await fetchWaterLevel(startDate, endDate, site.code, site.name);
        createChart(site.code, site.name, waterLevels);
    }
}

function formatDate(date) {
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayOfWeek[date.getDay()];
}

// Function to create a chart for a specific site with provided water level data
function createChart(siteCode, siteName, waterLevels) {
    const chartsGrid = document.getElementById('chartsGrid');
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    chartsGrid.appendChild(chartContainer);

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('height', '400');
    chartContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const labels = waterLevels.map(data => formatDate(data.time));
    const data = waterLevels.map(data => data.waterLevel);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Water Level at ${siteName}`, data: data , fill: false , borderColor: 'rgb(0, 128, 0)' , borderWidth: 1 , pointRadius: 5 , pointHoverRadius: 8 , tension: 0.1,
            }]
        },
        options: {
            scales: {
                        // x axis formatting
                x: {
                    type: 'time',
                    time: {
                        displayFormats: {
                            hour: 'MMM D, h:mm A' 
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date/Time'
                    }
                },
                        // y axis formatting
                y: {
                    title: {
                        display: true,
                        text: 'Water Level (ft)'
                    },
                    ticks: {
                        precision: 2,
                        stepSize: 0.1
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const value = tooltipItem.raw.y.toFixed(2); // Format water level to 2 decimal places
                            return `Water Level: ${value} ft`;
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true, mode: 'xy', speed: 10, rangeMin: { x: 3, y: null },rangeMax: { x: 3, y: null },
                    },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy',
                        limits: { max: 5, min: 0 }
                    }
                }
            }
        }
    });

    chart.pan({
        enabled: true, mode: 'xy', speed: 10,
        limits: {
            x: { min: 0, max: 10 },
            y: { min: 0, max: 10 }
        }
    });

    chart.zoom({
        wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy', limits: { max: 5, min: 0 }

    });

    canvas.addEventListener('wheel', event => {
        if (event.ctrlKey) {
            const deltaY = event.deltaY;
            if (deltaY < 0 && chart.scales.y.max <= 0) {
                event.preventDefault();
            }
        }
    });
}

function createChart(siteCode, siteName, waterLevels) {
    const chartsGrid = document.getElementById('chartsGrid');
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    chartsGrid.appendChild(chartContainer);

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width'&&'height','400');
    chartContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const labels = waterLevels.map(data => formatDate(data.time));
    const data = waterLevels.map(data => data.waterLevel);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Water Level at ${siteName}`,
                data: data, fill: false, borderColor: 'rgb(0, 128, 0)',borderWidth: 1,pointRadius: 1,pointHoverRadius: 5,tension: 0.1,
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true, text: 'Day of the Week',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Water Level (ft)'
                    },
                    ticks: {
                        precision: 1,
                        stepSize: 0.1
                    }
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,mode: 'xy',speed: 1,
                        mode: 'xy',
                        speed: 1,
                        rangeMin: { x: 3, y: null },
                        rangeMax: { x: 3, y: null }
                    },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy',
                        limits: { max: 1, min: 1 }
                    }
                }
            }
        }
    });

    chart.pan({
        enabled: true,
        mode: 'xy',
        speed: 10,
        limits: {
            x: { min: 0, max: 10 },y: { min: 0, max: 10 },
        }
    });

    chart.zoom({
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'xy',
        limits: { max: 5, min: 0 }
    });

    canvas.addEventListener('wheel', event => {
        if (event.ctrlKey) {
            const deltaY = event.deltaY;
            if (deltaY < 0 && chart.scales.y.max <= 0) {
                event.preventDefault();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const siteData = [
        { code: '07055660', name: 'Ponca, AR' },
        { code: '07055680', name: 'Pruitt, AR' },
        { code: '07055646', name: 'Boxley, AR' },
        { code: '07055780', name: 'Carver Access, AR' }
    ];

    await createCharts(startDate, endDate, siteData);

    const resetGraphBtn = document.getElementById('resetGraphBtn');
    resetGraphBtn.addEventListener('click', resetCharts);
});