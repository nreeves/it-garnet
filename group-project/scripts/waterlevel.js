// async function fetches water level data 
async function fetchWaterLevel(date) {
    try {
        // Construct url for the API using current date
        var url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07055660,07055680,07055646,07055780&siteStatus=all&startDT=${date}&endDT=${date}`;
        
        // API data pull
        const response = await fetch(url);
        // JSON conversion
        const responseData = await response.json();
        
        // is data good or bad check
        if (responseData.value && responseData.value.timeSeries) {
            // water level array storage
            var waterLevels = [];
            
            // create const assigning the site codes to their cooresponding names 
            const siteLocations = {
                "07055660": "Ponca, AR",
                "07055680": "Pruitt, AR",
                "07055646": "Boxley, AR",
                "07055780": "Carver Access, AR"
            };
            
            // iterate time series data
            responseData.value.timeSeries.forEach(series => {
                // site code api extraction
                var siteCode = series.sourceInfo.siteCode[0].value;
                
                // predefined site code check in api
                if (siteCode in siteLocations) {
                    // find "gage height variable code" in the api, it's 00065
                    var gageHeightVariable = series.variable.variableCode.find(variable => variable.value === "00065");
                    
                    // if gage height var is found -> extract the latest water level then push into the water level array on line 15
                    if (gageHeightVariable) {
                        var latestWaterLevel = series.values[0].value[0].value;
                        
                        waterLevels.push({ location: siteLocations[siteCode], waterLevel: latestWaterLevel });
                    }
                }
            });
            
            //element for displaying water level
            var waterLevelDiv = document.getElementById('waterLevelInfo');
            //clear water level info
            waterLevelDiv.innerHTML = '';
            
            //h2 header to display date
            var header = document.createElement('h2');
            header.textContent = `Buffalo River water height in feet for ${date}`;
            waterLevelDiv.appendChild(header);
            
            //displays all site + water level data as plain text in number form
            waterLevels.forEach(site => {
                var siteInfo = document.createElement('p');
                siteInfo.textContent = `Water level: ${site.location}: ${site.waterLevel} ft`;
                waterLevelDiv.appendChild(siteInfo);
            });
            
            // Update the chart with the fetched water level data
            updateChart(waterLevels);
        } else {
            console.error('no data available:', date);
        }
    } catch (error) {
        console.error('fetch error:', error);
    }
}

// function is supposed to update the water level, it doesn't
function updateChart(waterLevels) {
    // extract water levels and locations from the array
    var labels = waterLevels.map(waterLevel => waterLevel.location);
    var data = waterLevels.map(waterLevel => waterLevel.waterLevel);
    
    // chart.js canvas 2d, assigning waterlevelchart as it's name
    var ctx = document.getElementById('waterLevelChart').getContext('2d');
    // new chart
    var waterLevelChart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels, // Location labels
            datasets: [{
                label: 'water level ft', 
                data: data, // water levels as data points
                fill: true, 
                borderColor: 'rgb(75, 192, 192)', 
                tension: 0.1 
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Water Level (ft)' // Y-axis title
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Location' // X-axis title
                    }
                }
            }
        }
    });
}


document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    var startDateTimeInput = document.getElementById('startDateTimeInput').value;
    var selectedDate = new Date(startDateTimeInput).toISOString().slice(0, 10);
    
    fetchWaterLevel(selectedDate);
});

window.onload = function() {
    var currentDate = new Date().toISOString().slice(0, 10); // ISO8601 format
    fetchWaterLevel(currentDate);
};