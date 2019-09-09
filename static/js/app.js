// from data_added.js -> I added lat, lon data for each city/state in order to draw a map on the page.
const tableData = data_added;

// Select table body
const tBody = d3.select('tbody');

function unpack(rows, key) {
    return rows.map(row => row[key]);
}

// draw a plotly.js scatter plot on map 
function drawMap(latArray, lonArray, hoverText) {

    var dataMap = [{
        type: 'scattergeo',
        locationmode: 'USA-states',
        lat: latArray,
        lon: lonArray,
        hoverinfo: 'text',
        text: hoverText,
        marker: {
            // size: duration,
            color: 'yellow',
            line: {
                color: 'black',
                width: 2
            },
        }
    }];

    var layout = {
        title: 'UFO Sightings in US/Canada',
        font: {
            color: 'white'
        },
        dragmode: 'zoom',
        margin: {
            r: 20,
            t: 40,
            b: 20,
            l: 20,
            pad: 0
          },
        showlegend: false,
        geo: {
            scope: 'north america',
            projection: {
                type: 'albers usa'
            },
            showland: true,
            landcolor: 'black',
            subunitwidth: 1,
            countrywidth: 1,
            subunitcolor: 'grey',
            countrycolor: 'red'
        },
        paper_bgcolor: '#2b3e50',
    };

    // newPlot method allows to re-draw with the filtered data after search.
    Plotly.newPlot('map-plot', dataMap, layout);

}

// Redering a result table
function renderTable(filterArray, keyArray) {

    // When initializing or refreshing the page: None of filter keywords,
    if (!filterArray && !keyArray) {
        const temp = tableData.sort((a, b) => new Date(a.datetime) - new Date(b.datetime)) // sort by datetime
                              .map(item => {
                                const newRow = tBody.append('tr');
                                Object.values(item).forEach(value => {
                                    const newCell = newRow.append('td');
                                    newCell.text(value);
                                });
                                return item
                            });
                
        const cityNames = unpack(temp, 'city');
        const stateNames = unpack(temp, 'state');
        const hoverTexts = cityNames.map((city, index) => capitalizeFirstLetter(city) + ', ' + stateNames[index].toUpperCase());
        const latitudes = unpack(temp, 'lat');        
        const longitudes = unpack(temp, 'lon');
        
        // Draw a map plot with all the data in table
        drawMap(latitudes, longitudes, hoverTexts);

    }

    // if at least one filter keyword exists:
    else {
        let filtered = tableData;

        // Iterate over inputted search keywords in the array,
        // match and filter based on the relevant key in data.json 
        filterArray.forEach((keyword, index) => {
            if (keyword != '') {
                filtered = filtered.filter(item => item[`${keyArray[index]}`] === keyword);
            }
        });

        filtered = filtered.sort((a, b) => new Date(a.datetime) - new Date(b.datetime)) // sort by datetime
                           .map(item => {
                                const newRow = tBody.append('tr');
                                Object.values(item).forEach(value => {
                                    const newCell = newRow.append('td');
                                    newCell.text(value);
                                });                                
                                return item
                            });

        const cityNames = unpack(filtered, 'city');
        const stateNames = unpack(filtered, 'state');
        const hoverTexts = cityNames.map((city, index) => capitalizeFirstLetter(city) + ', ' + stateNames[index].toUpperCase());
        const latitudes = unpack(filtered, 'lat');        
        const longitudes = unpack(filtered, 'lon');

        // Draw a Map plot with filtered data
        drawMap(latitudes, longitudes, hoverTexts);

    }
};


// Initializing a table
renderTable();

// For capitalizing city names and shape names in dropdown list
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Assign cities to dropdown selection for search
// Sort and prevent duplicates
const dropDownCity = document.getElementById('dropdown-city');
let options = {};
tableData.sort((a, b) => {
    if (a.city > b.city) {
        return 1
    } else {
        return -1
    }
}).forEach((item, index) => {
    if (!options[item.city]) {
        options[item.city] = true;
        dropDownCity.options[dropDownCity.options.length] = new Option(capitalizeFirstLetter(item.city), index);
    }
});

// Assign states to dropdown selection for search
// Sort and prevent duplicates
const dropDownState = document.getElementById('dropdown-state');
options = {};
tableData.sort((a, b) => {
    if (a.state > b.state) {
        return 1
    } else {
        return -1
    }
}).forEach((item, index) => {
    if (!options[item.state]) {
        options[item.state] = true;
        dropDownState.options[dropDownState.options.length] = new Option(item.state.toUpperCase(), index);
    }
});

// Assign shapes to dropdown selection for search
// Sort and prevent duplicates
const dropDownShape= document.getElementById('dropdown-shape');
options = {};
tableData.sort((a, b) => {
    if (a.shape > b.shape) {
        return 1
    } else {
        return -1
    }
}).forEach((item, index) => {
    if (!options[item.shape]) {
        options[item.shape] = true;
        dropDownShape.options[dropDownShape.options.length] = new Option(capitalizeFirstLetter(item.shape), index);
    }
});

// Get the selected text from dropdown list
function getSelectedText(dropDown){
    const selected = dropDown.options[dropDown.selectedIndex].text;
    return selected.toLowerCase()
}

// Select input form and button and store them to each variable
const dateTime = d3.select('#datetime');
const filterButton = d3.select('#filter-btn');

// Advanced search function
function filterAdvanced() {
    d3.event.preventDefault();

    // Put search keywords into variables
    const searchDate = dateTime.node().value;
    let searchCity = getSelectedText(dropDownCity);
    if (searchCity === 'city') { searchCity = ''};

    let searchState = getSelectedText(dropDownState);
    if (searchState === 'state') { searchState = ''};

    let searchShape = getSelectedText(dropDownShape);
    if (searchShape === 'shape') { searchShape = ''};

    // For easing multiple keywords search, store search keywords into an array
    // and also put each relevant keyname into another array 
    const searchArray = new Array(searchDate, searchCity, searchState, searchShape);
    const keyArray = new Array('datetime', 'city', 'state', 'shape');

    // Remove all the data before displaying the filtered data
    tBody.selectAll('tr').remove();

    renderTable(searchArray, keyArray);
}

filterButton.on('click', filterAdvanced);