var map = L.map('myMap').setView([ -1.319380, 36.769141], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch("https://raw.githubusercontent.com/enock-ui/County/refs/heads/main_/Kenyancounties.json")

.then(response => response.json())
.then(data => {
    L.geoJSON(data).addTo(map);
})
.catch(error => console.error('Error loading GeoJSON:', error));

