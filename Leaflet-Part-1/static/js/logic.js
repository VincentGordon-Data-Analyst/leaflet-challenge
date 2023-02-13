var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Creating the map object
var myMap = L.map("map", {
  center: [37.96044, -112.30695],
  zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
  return magnitude * 10000;
}

function colorPicker(d) {
  return d > 100 ? "#d73027":
  d > 50 ? "#fc8d59":
  d > 25 ? "#fee08b":
  d > 12 ? "#ffffbf":
  d > 5 ? "#d9ef8b":
  d > 0 ? "#91cf60":
          "#1a9850";
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

    L.circle([location[1], location[0]], {
      weight: 2,
      fillOpacity: 0.7,
      color: colorPicker(depth),
      fillColor: colorPicker(depth),
      radius: markerSize(properties.mag)
    }).bindPopup(`<h1>${properties.title}</h1>`).addTo(myMap);  
      
    
  }
  // geojson = L.circle([location[0], location[1]], {
  //   radius: markerSize(features.properties.mag)
  // });


  // for (var i = 0; i < features.length; i++) {
  //   var feature = features[i];
  //   var coordinate = feature.geometry.coordinates;

  //   L.circle([coordinate[0], coordinate[1]], {
  //     fillOpacity: 0.75,
  //     color: "white",
  //     fillColor: "purple",
  //     radius: markerSize(feature.properties.mag)
  //   }).bindPopup(`<h1>${feature.properties.title}</h1>`).addTo(myMap);    
  // }
  
});



