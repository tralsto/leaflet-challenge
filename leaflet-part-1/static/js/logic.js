// Creating the map object
let myMap = L.map("map", {
    center: [0,-115],
    zoom: 3
});
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
  
// Load the GeoJSON data
let eqData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
  
// Define function to determine circle marker size based on earthquake magnitude
function circleSize(magnitude) {

    const minRadius = 1000;
    const maxRadius = 80000;

    return minRadius + (magnitude * (maxRadius - minRadius));

    // Adjust the scaling factor to correpond with earthquake magnitude
    // const circleScale = 5;
    // const maxSize = 50;
    // Circle size based on earthquake magnitude
    // const circleSize = magnitude * circleScale;
    // Ensure the circle size does not exceed the maximum size
    // return Math.max(circleSize, maxSize);
    
};

// Define a function to determine circle color based on earthquake depth
function circleColor(depth) {
    // You can customize the colors and depth ranges as needed
    if (depth >= -10 && depth <= 10) {
        return "#0ef022";
    } else if (depth > 10 && depth <= 30) {
        return "#bcfa0f"; // Light green
    } else if (depth > 30 && depth <= 50) {
        return "#e0bd12"; // Yellow
    } else if (depth > 50 && depth <= 70) {
        return "#fa9d16"; // Orange
    } else if (depth > 70 && depth <= 90) {
        return "#f03c02"; // Red
    } else {
        return "#b22222"; // Dark red
    }
};

// Get the data with d3
d3.json(eqData).then(function(data) {
    console.log(data);

    // Create a new marker cluster group
    let eqLayer = L.featureGroup();

    // Loop through the data
    data.features.forEach(function(features) {

        // Set the data points to a variable for the popup information
        let location = features.geometry.coordinates;
        let magnitude = features.properties.mag;
        let depth = features.geometry.coordinates[2];
        let place = features.properties.place;

        console.log(magnitude);

        // Create a circle marker with size and color based on magnitude and depth
        let circleMarker = L.circle([location[1], location[0]], {
            radius: circleSize(magnitude),
            color: circleColor(depth),
            fillOpacity: 0.7
        }).bindPopup(`<strong>Location:</strong> ${location}<br><strong>Location Name:</strong> ${place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`);

        eqLayer.addLayer(circleMarker);
    });

    // Add the earthquake circles to the map
    myMap.addLayer(eqLayer);

    // Create a legend
    let eqLegend = L.control({position: 'bottomright'});

    // Include earthquake depth ranges and colors in the legend
    eqLegend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [-10, 10, 30, 50, 70, 90];
        let colors = ["#0ef022", "#bcfa0f", "#e0bd12", "#fa9d16", "#f03c02", "#b22222"];

        for (let i = 0; i < depths.length; i++) {
            let from = depths[i];
            let to = depths[i + 1];
            let color = colors[i];

            div.innerHTML += `<i style="background:${color}"></i> ${from}${to ? '&ndash;' + to : '+'}<br>`;
        }
        return div;
    };

    // Add the legend to the map
    eqLegend.addTo(myMap);
});
