// Creating the map object
let myMap = L.map("map", {
    center: [0,-115],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  let eqData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
  
  // Get the data with d3.
  d3.json(eqData).then(function(data) {

    console.log(data);

    // Create a new marker cluster group.
    let markers = L.markerClusterGroup();


    // Add our marker cluster layer to the map.
    myMap.addLayer(markers);

  });