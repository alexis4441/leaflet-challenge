
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(earthquakeData) {
    console.log(earthquakeData);
    createFeatures(earthquakeData.features);
});

function createMarker(feature, coords) {
    return L.circleMarker(coords, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[1]),
        weight: 1,
        opacity: 1,
        fillOpacity: 2
    });
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[1]}`);
    }
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {
    let openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let myMap = L.map("map", {
        center: [37.09, -100.71],
        zoom: 4,
        layers: [openstreetmap, earthquakes]
    });


 let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'legend'),
            grades = [-10, 10, 30, 60, 90];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    

        return div;
        };
        legend.addTo(myMap);
}
function markerSize(magnitude) {
    return magnitude * 4;
}
let marker_limit = 1000;

for (let i = 0; i < marker_limit; i++) {

  let location = features[i].geometry;
  if(location){
    L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
  }
}
function markerColor(depth) {
    if (depth <= 10) return "#91cf60";
    else if (depth > 10 & depth <= 30) return "#d9ef8b";
    else if (depth > 30 & depth <= 50) return "yellow";
    else if (depth > 50 & depth <= 70) return "#fc8d59";
    else if (depth > 70 & depth <= 90) return "orange";
    else return "red";
};