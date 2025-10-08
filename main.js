var map = L.map('myMap').setView([ -1.319380, 36.769141], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
// --- Info Control ---
const info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with class "info"
  this.update();
  return this._div;
};

// Update the info based on feature properties
info.update = function (props) {
  this._div.innerHTML = props
    ? `<h4>${props.ADM1_EN} county </h4>
       <b>Population:</b> ${props.County_pop.toLocaleString()}<br>
       <b>Density:</b> ${props.Pop_Density.toLocaleString()} per km²`
    : 'Hover over a county';
};

info.addTo(map);

// --- Legend Control ---
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'legend');

  // Value ranges (in ascending order)
  const grades = [0, 50, 300, 500, 1000, 3000, 5000];
  
  // Descriptive labels that match each range
  const labels = [
    'Sparse',
    'Very Low',
    'Medium',
    'High',
    'Very High',
    'Densely',
    'Very Dense'
  ];

  // Loop through ranges and labels
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      `<i style="background:${getColor(grades[i] + 1)}"></i> ` +
      `${labels[i]} (${grades[i]}${grades[i + 1] ? '&ndash;' + grades[i + 1] : '+'})<br>`;
  }

  return div;
};

legend.addTo(map);

//Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const geojsonFiles = [
    "https://raw.githubusercontent.com/enock-ui/County/refs/heads/main_/Kenyancounties.json",
    ];


 function getColor(value) {
    return value > 5000 ? '#800026' :
           value > 3000  ? '#E31A1C' :
           value > 1000  ? '#FC4E2A' :
           value > 500   ? '#FD8D3C' :
           value > 300   ? '#FEB24C' :
           value > 50   ? '#FED976' :
                             '#ffe291ff';
  }

  // Style each feature
  function style(feature) {
    return {
      fillColor: getColor(feature.properties.Pop_Density),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.8
    };
  }

  // Popup info for each county
function onEachFeature(feature, layer) {
  if (feature.properties) {
    layer.bindPopup(`
      <div class="county-popup">
        <div class="popup-title">${feature.properties.ADM1_EN}</div>
        <div class="popup-body">
          <b>Population:</b> ${feature.properties.County_pop.toLocaleString()}<br>
          <b>Density:</b> ${feature.properties.Pop_Density.toLocaleString()} per km²
        </div>
      </div>
    `);
  }
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });

}
function highlightFeature(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 3,
    color: '#f5088aff',
    fillOpacity: 0.9
  });
  layer.bringToFront();
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  e.target.setStyle({
    weight: 1,
    color: 'white',
    fillOpacity: 0.8
  });
  info.update(); // clear panel
}
// Zoom
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}


// Adjust markers size dynamically as the zoom level changes
map.on('zoom', function () {
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            var newIcon = createCustomMarker(layer.getLatLng().lat, layer.getLatLng().lng);
            layer.setIcon(newIcon.options.icon);
        }
    });
})


 // Load GeoJSON file
  fetch('Kenyancounties.json')
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);
          });
