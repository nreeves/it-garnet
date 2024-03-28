
async function fetchWaterLevel() {

    var url = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07055660,07055680,07055646,07055780&siteStatus=all";

    try {
        // Fetch data from the API
        const response = await fetch(url);

        const responseData = await response.json();//we read json
        
        var waterLevels = [];//water level array 


        const siteLocations = { //create constants assigning the siteId's with actual cooresponding names
            "07055660": "Ponca, AR",
            "07055680": "Pruitt, AR",
            "07055646": "Boxley, Ar",
            "07055780": "Carver Access, AR"
        };

     
        responseData.value.timeSeries.forEach(series => {
           //site code fetch from api
            var siteCode = series.sourceInfo.siteCode[0].value;

    
            if (siteCode in siteLocations) {
                //water level parse
                var gageHeightVariable = series.variable.variableCode.find(variable => variable.value === "00065");

                //water level var check
                if (gageHeightVariable) {
                    //extract water level + assign series value array
                    var latestWaterLevel = series.values[0].value[0].value;

                    //send name + water level to array
                    waterLevels.push({ location: siteLocations[siteCode], waterLevel: latestWaterLevel });
                }
            }
        });
        
        var waterLevelDiv = document.getElementById('waterLevelInfo');//assign js var to html id


        var header = document.createElement('h2');
        header.textContent = "Water Level Information"; //append header to div
        waterLevelDiv.appendChild(header);

        
        waterLevels.forEach(site => {
            var siteInfo = document.createElement('p');
            siteInfo.textContent = `Water level: ${site.location}: ${site.waterLevel} ft`; //writes html p with site location + water level

            waterLevelDiv.appendChild(siteInfo);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

//call fetch on reload
window.onload = fetchWaterLevel;