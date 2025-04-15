// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create the map object with center and zoom options.
let map = L.map('map', {
  center: [37.09, -95.71],
  zoom: 4
});

// Create layer for labels
let labelLayer = L.layerGroup();

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map)





// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  
  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth <= 10)  return "#FEB24C";
    else if (depth <= 30 ) return "#FD8D3C";  
    else if (depth <= 50) return "#FC4E2A"; 
    else if (depth <= 70) return "#E31A1C";  
    else if (depth <= 90) return "#BD0026";
    else return "#800026";
}


// This function determines the radius of the earthquake marker based on its magnitude.
function getRadius(magnitude) {
  return magnitude * 6;
}

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data,{
  // Turn each feature into a circleMarker on the map.
  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng,{ 
    // Set the style for each circleMarker using our styleInfo function.
      radius: getRadius(feature.properties.mag),
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
      }).bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3> Magnitude: ${feature.properties.mag}</h3> <hr> <h3> Depth: ${feature.geometry.coordinates[2]}</h3>`)
  }
}).addTo(map);

// Lable layer
// const label = L.marker(latlng,{
  // icon: L.divIcon({
    // className: 'test',
    // html: `<strong>${tariff}%</strong>`,
    // iconSize: [30, 12],
    // iconAnchor: [15, -12]
  // })
// });

  // label.addTo(labelLayer);

// Legend
let info = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
info.onAdd = function (map) {
  let div = L.DomUtil.create("div", "info legend");

  // Initialize depth intervals and colors for the legend
  let depths = [-10, 10, 30, 50, 70, 90];
  let labels = [];

  // Loop through our depth intervals to generate a label with a colored square for each interval.
  for (let i= 0; i < depths.length; i++){
    let from = depths[i];
    let to  = depths[i + 1];

    labels.push(
      `<i style="background:${getColor(from + 1)}"></i> ${from}${to ? '&ndash;' + to : '+'}`
    );
  }

  div.innerHTML = labels.join('<br>');
  return div;

};

// Finally, add the legend to the map.
info.addTo(map);
});