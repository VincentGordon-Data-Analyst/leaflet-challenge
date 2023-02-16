var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Creating the map object
var myMap = L.map("map", {
  center: [37.96044, -122.30695],
  zoom: 6
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define the size of each magnitude
function markerSize(mag) {
  return mag * 10000;
}

// Define the colors for the detph of each magnitude
function colorPicker(d) {
  return d > 1000 ? "#d73027":
         d > 500 ? "#fc8d59":
         d > 300 ? "#fee08b":
         d > 120 ? "#ffffbf":
         d > 60 ? "#d9ef8b":
         d > 30 ? "#91cf60":
                  "#66bd63";
}

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  console.log(data)
  
  var features = data.features;
  for (var i = 0; i < features.length; i++) {
    var feature = features[i];

    var location = feature.geometry.coordinates;
    var properties = feature.properties;
    var depth = feature.geometry.coordinates[2];  

    // Plot a circle for each earthquake
    L.circle([location[1], location[0]], {
      weight: 0.55,
      fillOpacity: 0.75,
      color: 'black',
      fillColor: colorPicker(depth),
      radius: markerSize(properties.mag)
    }).bindPopup(`<h3>Location: ${properties.place}<br> Magnitude: ${properties.mag}</h3>`).addTo(myMap);  
  }

  // Add a legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
    severity = [0, 30, 60, 120, 300, 500, 1000];
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < severity.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colorPicker(severity[i] + 1) + '"></i> ' +
          severity[i] + (severity[i + 1] ? '&ndash;' + severity[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);

});



