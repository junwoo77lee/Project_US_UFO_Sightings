// from data.js
const tableData = data;
// Select table body
const tBody = d3.select('tbody');

// Initially, display all the data to the table body
function renderTable(filterText) {
    if (filterText.length == 0) {
        tableData.map(item => {
            const newRow = tBody.append('tr');
            Object.entries(item).forEach(([key, value]) => {
                const newCell = newRow.append('td');
                newCell.text(value);
            });
        });
    }
    else {
        console.log(filterText);
        tableData.filter(item => item.datetime === filterText)
        .map(item => {
                const newRow = tBody.append('tr');
                Object.entries(item).forEach(([key, value]) => {
                    const newCell = newRow.append('td');
                    newCell.text(value);
                });
            });
    }
}

renderTable('');


// Select input form and button and store them to each variable
const dateTime = d3.select('#datetime');
const filterButton = d3.select('#filter-btn');

function filterDate() {
    d3.event.preventDefault();
    date = dateTime.property('value');

    // Remove all the data before displaying the filtered data
    tBody.selectAll('tr').remove();

    renderTable(date);
}

filterButton.on('click', filterDate);
