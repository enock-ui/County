var map = L.map('myMap').setView([ -1.319380, 36.769141], 20
    );

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const geojsonFiles = [
    "https://raw.githubusercontent.com/enock-ui/County/refs/heads/main/Kenyancounties.json",
    
    ];

// Create markers

// Adjust markers size dynamically as the zoom level changes
map.on('zoom', function () {
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            var newIcon = createCustomMarker(layer.getLatLng().lat, layer.getLatLng().lng);
            layer.setIcon(newIcon.options.icon);
        }
    });
})




async function loadGeoJSONFiles() {
    try {
        const fetchPromises = geojsonFiles.map(url => fetch(url).then(res => res.json()));
        const geojsonData = await Promise.all(fetchPromises);

        geojsonData.forEach(data => {
            L.geoJSON(data).addTo(map);
        });

    } catch (error) {
        console.error('Error loading GeoJSON:', error);
    }
}

// Call function to load GeoJSONs
loadGeoJSONFiles();

// Load all GeoJSON files

