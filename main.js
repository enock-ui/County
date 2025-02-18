var map = L.map('myMap').setView([ -1.319380, 36.769141], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const geojsonFiles = [
"https://raw.githubusercontent.com/enock-ui/County/refs/heads/main_/Kenyancounties.json",
"https://raw.githubusercontent.com/enock-ui/County/refs/heads/main/Hospitals.geojson",

];

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

