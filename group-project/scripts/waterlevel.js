// Async javascript function called "fetchWaterLevel" that is retrieving the water data from the USGS API
//NOTE: TIME SERIES REFERS to INFORMATION SUCH AS SITE, VARS, DATA VALUES, TIME INTERVALS,responseData.value.timeSeries is the array containing all time series information from the USGS

// This function fetches water level data from the USGS API for a specific site within a given date range
async function fetchWaterLevel(startDate, endDate, siteCode, siteName) {
    try {
        // Construct the URL for the API request using provided parameters
        const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteCode}&siteStatus=all&startDT=${startDate}&endDT=${endDate}`;
        
        
        const response = await fetch(url); // fetch from api 
        
        // parse data in json format
        const responseData = await response.json();
        
        // validity check
        if (responseData.value && responseData.value.timeSeries) {
            // array to store water data in WaterLevels
            const waterLevels = [];
            
            // Iterate through each time series in the response data
            responseData.value.timeSeries.forEach(series => {
                // Find the gage height variable within the time series
                const gageHeightVariable = series.variable.variableCode.find(variable => variable.value === "00065");
                
                // gage height var check
                if (gageHeightVariable) {
                    // time series iteration
                    series.values[0].value.forEach(value => {
                        // convert date-time string to a JS Object for interoperability
                        const dateTime = new Date(value.dateTime);
                        
                        // creates object and pushes time + waterlevel to the array 
                        waterLevels.push({ time: dateTime, waterLevel: parseFloat(value.value) });
                    });
                }
            });
        
            return waterLevels;

        } 
    } catch (error) {
        console.error('fetch failure', error);
    }
}

// function creating graph for all sites 
async function createCharts(startDate, endDate, siteData) {
    //get chartsGrid element
    const chartsGrid = document.getElementById('chartsGrid');

    // site loop in the array site[Data]
    for (let i = 0; i < siteData.length; i++) {
        // Extract site information
        const site = siteData[i];
        
        // water level for current site
        const waterLevels = await fetchWaterLevel(startDate, endDate, site.code, site.name);
        
        createChart(site.code, site.name, waterLevels);
    }
}

// chart for each site
function createChart(siteCode, siteName, waterLevels) {
    // assigning html element chartsGrid for use later
    const chartsGrid = document.getElementById('chartsGrid');

    // container for canvas
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    chartsGrid.appendChild(chartContainer);

    // creating canvas with 400x400 attributes
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('height', '400');
    chartContainer.appendChild(canvas);

    // render 2d
    const ctx = canvas.getContext('2d');

    // array to store chart labels and data
    const labels = [];
    const data = [];

    // array of week days 
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // iterative loop to cycle days
    for (let i = 0; i < 7; i++) {
        // get date of current day
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);
        
        // current day of the week
        const dayLabel = daysOfWeek[currentDate.getDay()];
        
        // water level for currentDate
        const waterLevel = waterLevels.find(data => new Date(data.time).getDay() === currentDate.getDay());
        
        // loop that interates over 7 days, checking and pulling the data available from the API for each day
        if (waterLevel) {
            
            labels.unshift(dayLabel);
            data.unshift(waterLevel.waterLevel);
        } 
    }

    // chart.js customizing for the graph not important information
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Water Level at ${siteName}`,
                data: data,
                fill: false,
                borderColor: 'rgb(0, 128, 0)',
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Water Level (ft)'
                    },
                    suggestedMax: 10
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                     //on hover label customize adding feet and colon ,    
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': '; 
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2) + ' ft';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// formats date, responds with current day
function formatDate(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return daysOfWeek[date.getDay()];
}

// event listener for DOM content
document.addEventListener('DOMContentLoaded', function() {
    // get today's date in ISO format
    const endDate = new Date().toISOString().slice(0, 10);
    
    // ISO format
    const startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    // associate site codes with cooresponding site names
    const siteData = [
        { code: '07055660', name: 'Ponca, AR' },
        { code: '07055680', name: 'Pruitt, AR' },
        { code: '07055646', name: 'Boxley, AR' },
        { code: '07055780', name: 'Carver Access, AR' }
    ];

    // generate chart

    createCharts(startDate, endDate, siteData);
});